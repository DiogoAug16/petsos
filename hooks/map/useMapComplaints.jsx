import { CITY_LEVEL_MAX_DELTA, MAP_PREFETCH_MAX_DELTA } from '@/constants/map/map.constants';
import { useMapTileInvalidations } from '@/hooks/map/useMapTileInvalidations';
import {
  getMapComplaintTilesBatch,
  getMapComplaints,
  getMapTilesIndex,
} from '@/services/complaints/complaints.service';
import {
  buildFetchRegions,
  createMapMarkerCache,
  getMapTile,
  getMapTilesForRegion,
  MAP_TILE_ZOOM,
} from '@/utils/map/map-marker-cache';
import { drainMapTileInvalidations } from '@/utils/map/map-tile-invalidation-store';
import {
  readLocalCache,
  removeLocalCache,
  writeLocalCache,
} from '@/utils/shared/local-cache';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const MAP_FETCH_DEBOUNCE_MS = 350;
const INITIAL_MAP_BOOTSTRAP_DELTA = 0.12;
const TILE_INDEX_RADIUS_KM = 10;
const TILE_INDEX_REGION_TTL_MS = 60 * 1000;
const TILE_LOCAL_CACHE_MAX_AGE_MS = 10 * 60 * 1000;

const getTileCacheKey = (tileKey) => `map:tile:${tileKey}`;

export function useMapComplaints({
  visibleRegion,
  prefetchRegion,
  movement,
  enabled = true,
}) {
  const [complaints, setComplaints] = useState([]);
  const hasFetchedRef = useRef(false);
  const latestRequestRef = useRef(0);
  const latestVisibleRegionRef = useRef(visibleRegion);
  const latestTileParamsRef = useRef({ visibleRegion, prefetchRegion, movement });
  const tileIndexRegionCacheRef = useRef(new Map());
  const cacheRef = useRef(createMapMarkerCache());
  const shouldFetch =
    enabled &&
    visibleRegion &&
    prefetchRegion &&
    visibleRegion.latitudeDelta <= CITY_LEVEL_MAX_DELTA &&
    visibleRegion.longitudeDelta <= CITY_LEVEL_MAX_DELTA &&
    prefetchRegion.latitudeDelta <= MAP_PREFETCH_MAX_DELTA &&
    prefetchRegion.longitudeDelta <= MAP_PREFETCH_MAX_DELTA;

  const regionKey = useMemo(() => {
    if (!shouldFetch) return null;
    const indexTile = getMapTile(
      prefetchRegion.latitude,
      prefetchRegion.longitude,
      MAP_TILE_ZOOM
    );
    return `${indexTile.key}:${TILE_INDEX_RADIUS_KM}`;
  }, [prefetchRegion, shouldFetch]);

  useEffect(() => {
    latestVisibleRegionRef.current = visibleRegion;
    latestTileParamsRef.current = { visibleRegion, prefetchRegion, movement };
    setComplaints(cacheRef.current.getVisible(visibleRegion));
  }, [movement, prefetchRegion, visibleRegion]);

  const loadTileIndex = useCallback(async () => {
    if (!shouldFetch || !regionKey) return;

    const cachedAt = tileIndexRegionCacheRef.current.get(regionKey);
    if (cachedAt && Date.now() - cachedAt <= TILE_INDEX_REGION_TTL_MS) {
      return;
    }

    try {
      const indexItems = await getMapTilesIndex({
        lat: prefetchRegion.latitude,
        lng: prefetchRegion.longitude,
        radiusKm: TILE_INDEX_RADIUS_KM,
        z: MAP_TILE_ZOOM,
      });
      tileIndexRegionCacheRef.current.set(regionKey, Date.now());
      cacheRef.current.setTileIndex(indexItems);
    } catch {
      cacheRef.current.markTileIndexUnavailable();
    }
  }, [prefetchRegion, regionKey, shouldFetch]);

  const refetch = useCallback(
    async ({ forceTileKeys = [] } = {}) => {
      const requestId = latestRequestRef.current + 1;
      latestRequestRef.current = requestId;
      const shouldBootstrapInitialRegion =
        !hasFetchedRef.current && forceTileKeys.length === 0;

      if (!shouldFetch) {
        return false;
      }

      await loadTileIndex();

      const forcedFetchRegions = cacheRef.current.getFetchRegionsForTileKeys(
        forceTileKeys
      );
      const missingFetchRegions = cacheRef.current.getMissingFetchRegions({
        visibleRegion,
        prefetchRegion,
        movement,
      });
      const fetchRegionsByKey = new Map();

      [...forcedFetchRegions, ...missingFetchRegions].forEach((fetchRegion) => {
        fetchRegionsByKey.set(fetchRegion.key, fetchRegion);
      });

      const fetchRegions = [...fetchRegionsByKey.values()];

      const cachedTiles = await Promise.all(
        fetchRegions.map(async (fetchRegion) => {
          const items = await readLocalCache(getTileCacheKey(fetchRegion.key), {
            maxAgeMs: TILE_LOCAL_CACHE_MAX_AGE_MS,
          });
          return Array.isArray(items)
            ? {
                fetchRegion,
                items,
              }
            : null;
        })
      );

      cachedTiles.filter(Boolean).forEach(({ fetchRegion, items }) => {
        cacheRef.current.addFetchResult({ fetchRegion, data: items });
      });

      const cachedTileKeys = new Set(
        cachedTiles
          .filter(Boolean)
          .map(({ fetchRegion }) => fetchRegion.key)
      );
      const networkFetchRegions = fetchRegions.filter(
        (fetchRegion) => !cachedTileKeys.has(fetchRegion.key)
      );

      if (cachedTileKeys.size > 0) {
        cacheRef.current.prune(latestVisibleRegionRef.current);
      }

      if (networkFetchRegions.length > 0) {
        cacheRef.current.markInFlight(networkFetchRegions);

        try {
          const tiles = await getMapComplaintTilesBatch(networkFetchRegions);
          cacheRef.current.addBatchFetchResults({ fetchRegions: networkFetchRegions, tiles });
          tiles.forEach((tile) => {
            if (tile?.tileKey && Array.isArray(tile.items)) {
              writeLocalCache(getTileCacheKey(tile.tileKey), tile.items);
            }
          });
        } finally {
          cacheRef.current.settleFetchRegions(networkFetchRegions);
        }
        cacheRef.current.prune(latestVisibleRegionRef.current);
      }

      if (
        shouldBootstrapInitialRegion &&
        cacheRef.current.getVisible(latestVisibleRegionRef.current).length === 0
      ) {
        const bootstrapComplaints = await getMapComplaints({
          latitude: visibleRegion.latitude,
          longitude: visibleRegion.longitude,
          latitudeDelta: Math.max(
            Number(visibleRegion.latitudeDelta || 0),
            INITIAL_MAP_BOOTSTRAP_DELTA
          ),
          longitudeDelta: Math.max(
            Number(visibleRegion.longitudeDelta || 0),
            INITIAL_MAP_BOOTSTRAP_DELTA
          ),
        });
        cacheRef.current.addComplaints(bootstrapComplaints);
        cacheRef.current.prune(latestVisibleRegionRef.current);
      }

      if (requestId === latestRequestRef.current) {
        setComplaints(cacheRef.current.getVisible(latestVisibleRegionRef.current));
      }

      return true;
    },
    [loadTileIndex, movement, prefetchRegion, shouldFetch, visibleRegion]
  );

  const applyTileInvalidation = useCallback(
    ({ tileKeys, complaintId, action }) => {
      cacheRef.current.invalidateTiles({ tileKeys, complaintId, action });
      tileKeys?.forEach((tileKey) => removeLocalCache(getTileCacheKey(tileKey)));
      tileIndexRegionCacheRef.current.clear();

      const latestParams = latestTileParamsRef.current;
      const activeTileKeys = [
        ...getMapTilesForRegion(latestParams.visibleRegion).map((tile) => tile.key),
        ...getMapTilesForRegion(latestParams.prefetchRegion).map((tile) => tile.key),
        ...buildFetchRegions(latestParams).map((fetchRegion) => fetchRegion.key),
      ].filter(Boolean);
      const activeTileKeySet = new Set(activeTileKeys);
      const affectedTileKeys = (tileKeys || []).filter((tileKey) =>
        activeTileKeySet.has(tileKey)
      );

      if (affectedTileKeys.length > 0) {
        refetch({ forceTileKeys: affectedTileKeys });
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
        .then((didFetch) => {
          if (didFetch) {
            hasFetchedRef.current = true;
          }
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
