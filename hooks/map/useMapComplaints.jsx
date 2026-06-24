import { CITY_LEVEL_MAX_DELTA, MAP_PREFETCH_MAX_DELTA } from '@/constants/map/map.constants';
import { useMapTileInvalidations } from '@/hooks/map/useMapTileInvalidations';
import { getMapComplaints } from '@/services/complaints/complaints.service';
import {
  buildFetchRegions,
  createMapMarkerCache,
  getMapTile,
} from '@/utils/map/map-marker-cache';
import { drainMapTileInvalidations } from '@/utils/map/map-tile-invalidation-store';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const MAP_FETCH_DEBOUNCE_MS = 120;

export function useMapComplaints({ visibleRegion, prefetchRegion, movement }) {
  const [complaints, setComplaints] = useState([]);
  const hasFetchedRef = useRef(false);
  const latestRequestRef = useRef(0);
  const latestVisibleRegionRef = useRef(visibleRegion);
  const latestTileParamsRef = useRef({ visibleRegion, prefetchRegion, movement });
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
  }, [movement, prefetchRegion, visibleRegion]);

  const refetch = useCallback(
    async () => {
      const requestId = latestRequestRef.current + 1;
      latestRequestRef.current = requestId;

      if (!shouldFetch) {
        return;
      }

      const fetchRegions = cacheRef.current.getMissingFetchRegions({
        visibleRegion,
        prefetchRegion,
        movement,
      });

      if (fetchRegions.length === 0) {
        setComplaints(cacheRef.current.getVisible(latestVisibleRegionRef.current));
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

      if (requestId <= latestRequestRef.current) {
        setComplaints(cacheRef.current.getVisible(latestVisibleRegionRef.current));
      }
    },
    [movement, prefetchRegion, shouldFetch, visibleRegion]
  );

  const applyTileInvalidation = useCallback(
    ({ tileKeys, complaintId, action }) => {
      cacheRef.current.invalidateTiles({ tileKeys, complaintId, action });

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
    shouldShowComplaintMarkers: Boolean(shouldFetch),
    refetchMapComplaints: refetch,
  };
}
