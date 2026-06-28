import { CITY_LEVEL_MAX_DELTA, MAP_PREFETCH_MAX_DELTA } from '@/constants/map/map.constants';
import { useMapTileInvalidations } from '@/hooks/map/useMapTileInvalidations';
import {
  getMapComplaints,
  getMapTileHints,
} from '@/services/complaints/complaints.service';
import {
  buildFetchRegions,
  createMapMarkerCache,
  getMapTile,
  MAP_TILE_ZOOM,
} from '@/utils/map/map-marker-cache';
import { drainMapTileInvalidations } from '@/utils/map/map-tile-invalidation-store';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const MAP_FETCH_DEBOUNCE_MS = 120;
const TILE_HINT_RADIUS_KM = 10;
const TILE_HINT_REGION_TTL_MS = 60 * 1000;

export function useMapComplaints({ visibleRegion, prefetchRegion, movement }) {
  const [complaints, setComplaints] = useState([]);
  const [tileHints, setTileHints] = useState([]);
  const hasFetchedRef = useRef(false);
  const latestRequestRef = useRef(0);
  const latestVisibleRegionRef = useRef(visibleRegion);
  const latestTileParamsRef = useRef({ visibleRegion, prefetchRegion, movement });
  const tileHintRegionCacheRef = useRef(new Map());
  const cacheRef = useRef(createMapMarkerCache());
  const shouldFetch =
    visibleRegion &&
    prefetchRegion &&
    visibleRegion.latitudeDelta <= CITY_LEVEL_MAX_DELTA &&
    visibleRegion.longitudeDelta <= CITY_LEVEL_MAX_DELTA &&
    prefetchRegion.latitudeDelta <= MAP_PREFETCH_MAX_DELTA &&
    prefetchRegion.longitudeDelta <= MAP_PREFETCH_MAX_DELTA;

  const regionKey = useMemo(() => {
    if (!shouldFetch) return null;
    return [
      Number(prefetchRegion.latitude).toFixed(3),
      Number(prefetchRegion.longitude).toFixed(3),
      Number(prefetchRegion.latitudeDelta).toFixed(3),
      Number(prefetchRegion.longitudeDelta).toFixed(3),
    ].join(':');
  }, [prefetchRegion, shouldFetch]);

  useEffect(() => {
    latestVisibleRegionRef.current = visibleRegion;
    latestTileParamsRef.current = { visibleRegion, prefetchRegion, movement };
    setComplaints(cacheRef.current.getVisible(visibleRegion));
    setTileHints(cacheRef.current.getVisibleTileHints(visibleRegion));
  }, [movement, prefetchRegion, visibleRegion]);

  const loadTileHints = useCallback(async () => {
    if (!shouldFetch || !regionKey) return;

    const cachedAt = tileHintRegionCacheRef.current.get(regionKey);
    if (cachedAt && Date.now() - cachedAt <= TILE_HINT_REGION_TTL_MS) {
      setTileHints(cacheRef.current.getVisibleTileHints(latestVisibleRegionRef.current));
      return;
    }

    try {
      const hints = await getMapTileHints({
        lat: prefetchRegion.latitude,
        lng: prefetchRegion.longitude,
        radiusKm: TILE_HINT_RADIUS_KM,
        z: MAP_TILE_ZOOM,
      });
      tileHintRegionCacheRef.current.set(regionKey, Date.now());
      cacheRef.current.setTileHints(hints);
    } catch {
      cacheRef.current.markTileHintsUnavailable();
    }

    setTileHints(cacheRef.current.getVisibleTileHints(latestVisibleRegionRef.current));
  }, [prefetchRegion, regionKey, shouldFetch]);

  const refetch = useCallback(
    async () => {
      const requestId = latestRequestRef.current + 1;
      latestRequestRef.current = requestId;

      if (!shouldFetch) {
        return;
      }

      await loadTileHints();

      const fetchRegions = cacheRef.current.getMissingFetchRegions({
        visibleRegion,
        prefetchRegion,
        movement,
      });

      if (fetchRegions.length === 0) {
        setComplaints(cacheRef.current.getVisible(latestVisibleRegionRef.current));
        setTileHints(cacheRef.current.getVisibleTileHints(latestVisibleRegionRef.current));
        return;
      }

      cacheRef.current.markInFlight(fetchRegions);

      const responses = await Promise.allSettled(
        fetchRegions.map(async (fetchRegion) => {
          const data = await getMapComplaints(fetchRegion);
          return { fetchRegion, data };
        })
      );

      responses.forEach((response) => {
        if (response.status !== 'fulfilled') return;

        cacheRef.current.addFetchResult(response.value);
      });

      cacheRef.current.settleFetchRegions(fetchRegions);
      cacheRef.current.prune(latestVisibleRegionRef.current);

      if (requestId === latestRequestRef.current) {
        setComplaints(cacheRef.current.getVisible(latestVisibleRegionRef.current));
        setTileHints(cacheRef.current.getVisibleTileHints(latestVisibleRegionRef.current));
      }
    },
    [loadTileHints, movement, prefetchRegion, shouldFetch, visibleRegion]
  );

  const applyTileInvalidation = useCallback(
    ({ tileKeys, complaintId, action }) => {
      cacheRef.current.invalidateTiles({ tileKeys, complaintId, action });
      tileHintRegionCacheRef.current.clear();

      const latestParams = latestTileParamsRef.current;
      const visibleTileKey = latestParams.visibleRegion
        ? getMapTile(
            latestParams.visibleRegion.latitude,
            latestParams.visibleRegion.longitude
          ).key
        : null;
      const activeTileKeys = [
        visibleTileKey,
        ...buildFetchRegions(latestParams).map((fetchRegion) => fetchRegion.key),
      ].filter(Boolean);
      const shouldRefresh = tileKeys?.some((tileKey) =>
        activeTileKeys.includes(tileKey)
      );

      if (shouldRefresh) {
        refetch();
        return;
      }

      setComplaints(cacheRef.current.getVisible(latestVisibleRegionRef.current));
      setTileHints(cacheRef.current.getVisibleTileHints(latestVisibleRegionRef.current));
    },
    [refetch]
  );

  useMapTileInvalidations(
    useCallback(
      (payload) => {
        applyTileInvalidation(payload);
      },
      [applyTileInvalidation]
    )
  );

  useEffect(() => {
    const pendingInvalidations = drainMapTileInvalidations();
    pendingInvalidations.forEach(applyTileInvalidation);
  }, [applyTileInvalidation]);

  useEffect(() => {
    const delay = hasFetchedRef.current ? MAP_FETCH_DEBOUNCE_MS : 0;
    const timer = setTimeout(() => {
      refetch()
        .then(() => {
          hasFetchedRef.current = true;
        })
        .catch((error) => {
          if (error.name !== 'AbortError') setComplaints([]);
        });
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [refetch, regionKey]);

  return {
    complaints,
    tileHints,
    shouldShowComplaintMarkers: Boolean(shouldFetch),
    refetchMapComplaints: refetch,
  };
}
