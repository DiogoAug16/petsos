import { MAP_PREFETCH_MAX_DELTA } from '@/constants/map/map.constants';

const MAX_CACHED_MARKERS = 500;
const MAX_RENDERED_MARKERS = 150;
const MAX_TILE_FETCHES_PER_REGION = 3;
const TILE_CACHE_TTL_MS = 10 * 60 * 1000;
const TILE_QUERY_OVERLAP = 0.75;
const TILE_MIN_DELTA = 0.07;
const TILE_OVERSCAN = 1.1;
export const MAP_TILE_ZOOM = 12;

const getComplaintId = (complaint) => complaint?.id ?? complaint?._id;

const clampQueryDelta = (value) =>
  Math.min(Math.max(value, TILE_MIN_DELTA), MAP_PREFETCH_MAX_DELTA);

const getDistanceFromRegion = (complaint, region) => {
  const latitude = Number(complaint?.location?.latitude);
  const longitude = Number(complaint?.location?.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || !region) {
    return Number.POSITIVE_INFINITY;
  }

  return Math.abs(latitude - region.latitude) + Math.abs(longitude - region.longitude);
};

export const getVisibleComplaints = (cache, region) => {
  return [...cache.values()].slice(0, MAX_RENDERED_MARKERS);
};

const getNearestComplaints = (cache, region) => {
  return [...cache.values()].sort((first, second) => {
    return getDistanceFromRegion(first, region) - getDistanceFromRegion(second, region);
  });
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const isFiniteNumber = (value) => Number.isFinite(Number(value));

const isValidMapRegion = (region) => {
  return (
    region &&
    isFiniteNumber(region.latitude) &&
    isFiniteNumber(region.longitude) &&
    isFiniteNumber(region.latitudeDelta) &&
    isFiniteNumber(region.longitudeDelta) &&
    Number(region.latitudeDelta) > 0 &&
    Number(region.longitudeDelta) > 0
  );
};

export const getMapTile = (latitude, longitude, zoom = MAP_TILE_ZOOM) => {
  const safeLatitude = clamp(latitude, -85.05112878, 85.05112878);
  const safeLongitude = clamp(longitude, -180, 180);
  const latitudeRadians = (safeLatitude * Math.PI) / 180;
  const tiles = 2 ** zoom;
  const x = clamp(Math.floor(((safeLongitude + 180) / 360) * tiles), 0, tiles - 1);
  const y = clamp(
    Math.floor(
      ((1 -
        Math.log(Math.tan(latitudeRadians) + 1 / Math.cos(latitudeRadians)) /
          Math.PI) /
        2) *
        tiles,
    ),
    0,
    tiles - 1,
  );

  return {
    key: `${zoom}:${x}:${y}`,
    tileZ: zoom,
    tileX: x,
    tileY: y,
  };
};

export const parseMapTileKey = (tileKey) => {
  const [tileZ, tileX, tileY] = String(tileKey || '')
    .split(':')
    .map(Number);

  if (![tileZ, tileX, tileY].every(Number.isInteger)) return null;

  return {
    key: `${tileZ}:${tileX}:${tileY}`,
    tileZ,
    tileX,
    tileY,
  };
};

const tileYToLatitude = (y, zoom) => {
  const radians = Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / 2 ** zoom)));
  return (radians * 180) / Math.PI;
};

export const getMapTileBounds = ({ tileZ, tileX, tileY }) => {
  const tiles = 2 ** tileZ;
  return {
    north: tileYToLatitude(tileY, tileZ),
    south: tileYToLatitude(tileY + 1, tileZ),
    west: (tileX / tiles) * 360 - 180,
    east: ((tileX + 1) / tiles) * 360 - 180,
  };
};

const getMapTileCenter = (tile) => {
  const bounds = getMapTileBounds(tile);
  return {
    latitude: (bounds.north + bounds.south) / 2,
    longitude: (bounds.east + bounds.west) / 2,
  };
};

export const getMapTilesForRegion = (region, zoom = MAP_TILE_ZOOM) => {
  if (!isValidMapRegion(region)) return [];

  const latitudeDelta = Number(region.latitudeDelta);
  const longitudeDelta = Number(region.longitudeDelta);
  const north = Number(region.latitude) + latitudeDelta / 2;
  const south = Number(region.latitude) - latitudeDelta / 2;
  const west = Number(region.longitude) - longitudeDelta / 2;
  const east = Number(region.longitude) + longitudeDelta / 2;
  const northWest = getMapTile(north, west, zoom);
  const southEast = getMapTile(south, east, zoom);
  const tiles = [];

  for (let tileX = northWest.tileX; tileX <= southEast.tileX; tileX += 1) {
    for (let tileY = northWest.tileY; tileY <= southEast.tileY; tileY += 1) {
      tiles.push({
        key: `${zoom}:${tileX}:${tileY}`,
        tileZ: zoom,
        tileX,
        tileY,
      });
    }
  }

  return tiles;
};

const normalizeTileIndexItem = (item) => {
  const z = Number(item?.z);
  const x = Number(item?.x);
  const y = Number(item?.y);
  const count = Number(item?.count ?? 0);

  if (!Number.isInteger(z) || !Number.isInteger(x) || !Number.isInteger(y) || count <= 0) {
    return null;
  }

  const key = item.tileKey || `${z}:${x}:${y}`;
  const tile = { key, tileZ: z, tileX: x, tileY: y };

  return {
    ...item,
    ...tile,
    count,
  };
};

const getTileCoordinates = (tile) => {
  const bounds = getMapTileBounds(tile);
  const coordinates = [
    { latitude: bounds.north, longitude: bounds.west },
    { latitude: bounds.north, longitude: bounds.east },
    { latitude: bounds.south, longitude: bounds.east },
    { latitude: bounds.south, longitude: bounds.west },
  ];

  return coordinates.every(
    (coordinate) =>
      isFiniteNumber(coordinate.latitude) && isFiniteNumber(coordinate.longitude),
  )
    ? coordinates
    : [];
};

export const buildFetchRegions = ({ visibleRegion, prefetchRegion, movement }) => {
  if (!visibleRegion || !prefetchRegion) return [];

  const latitudeDelta = clampQueryDelta(prefetchRegion.latitudeDelta * TILE_OVERSCAN);
  const longitudeDelta = clampQueryDelta(prefetchRegion.longitudeDelta * TILE_OVERSCAN);
  const latitudeStep = latitudeDelta * TILE_QUERY_OVERLAP;
  const longitudeStep = longitudeDelta * TILE_QUERY_OVERLAP;
  const directionLatitude = Math.sign(Number(movement?.latitude || 0));
  const directionLongitude = Math.sign(Number(movement?.longitude || 0));
  const offsets = [];
  const seen = new Set();
  const seenTiles = new Set();

  const addOffset = (latitudeOffset, longitudeOffset, priority) => {
    const key = `${latitudeOffset}:${longitudeOffset}`;
    if (seen.has(key)) return;
    seen.add(key);
    offsets.push({ latitudeOffset, longitudeOffset, priority });
  };

  addOffset(0, 0, 0);

  if (directionLatitude || directionLongitude) {
    addOffset(directionLatitude, directionLongitude, -3);
    if (directionLatitude) addOffset(directionLatitude, 0, -2);
    if (directionLongitude) addOffset(0, directionLongitude, -2);
    addOffset(directionLatitude * 2, directionLongitude * 2, -1);
  } else {
    addOffset(1, 0, 1);
    addOffset(-1, 0, 1);
    addOffset(0, 1, 1);
  }

  const visibleFetchRegions = getMapTilesForRegion(visibleRegion).map((tile) => ({
    ...tile,
    ...getMapTileCenter(tile),
    latitudeDelta,
    longitudeDelta,
    visible: true,
  }));

  return [...visibleFetchRegions, ...offsets
    .sort((first, second) => first.priority - second.priority)
    .map(({ latitudeOffset, longitudeOffset }) => {
      const latitude = prefetchRegion.latitude + latitudeOffset * latitudeStep;
      const longitude = prefetchRegion.longitude + longitudeOffset * longitudeStep;
      const tile = getMapTile(latitude, longitude);

      return {
        ...tile,
        latitude,
        longitude,
        latitudeDelta,
        longitudeDelta,
        visible: false,
      };
    })]
    .filter((fetchRegion) => {
      if (seenTiles.has(fetchRegion.key)) return false;
      seenTiles.add(fetchRegion.key);
      return true;
    });
};

export const buildDebugTiles = ({ visibleRegion, prefetchRegion, movement }) => {
  if (!isValidMapRegion(visibleRegion) || !isValidMapRegion(prefetchRegion)) return [];

  const activeTile = getMapTile(visibleRegion.latitude, visibleRegion.longitude);
  const tilesByKey = new Map();

  for (const tile of [activeTile, ...buildFetchRegions({ visibleRegion, prefetchRegion, movement })]) {
    const coordinates = getTileCoordinates(tile);
    if (coordinates.length < 4) continue;

    tilesByKey.set(tile.key, {
      key: tile.key,
      coordinates,
      active: tile.key === activeTile.key,
    });
  }

  return [...tilesByKey.values()];
};

export const createMapMarkerCache = () => {
  const complaintsCache = new Map();
  const tileCache = new Map();
  const tileCacheBusters = new Map();
  const tileComplaintIds = new Map();
  const tileIndex = new Map();
  const inFlightTiles = new Set();
  let tileIndexReady = false;

  const getVisible = (region) => getVisibleComplaints(complaintsCache, region);

  const setTileIndex = (items = []) => {
    tileIndexReady = true;
    items.forEach((item) => {
      const normalized = normalizeTileIndexItem(item);
      if (!normalized) return;
      tileIndex.set(normalized.key, normalized);
    });
  };

  const markTileIndexUnavailable = () => {
    tileIndexReady = false;
  };

  const getMissingFetchRegions = (params) => {
    const now = Date.now();
    return buildFetchRegions(params)
      .filter((fetchRegion) => {
        const cachedAt = tileCache.get(fetchRegion.key);
        const hasFreshTile = cachedAt && now - cachedAt <= TILE_CACHE_TTL_MS;
        const indexItem = tileIndex.get(fetchRegion.key);
        const shouldFetchByIndex =
          fetchRegion.visible ||
          !tileIndexReady ||
          Boolean(indexItem) ||
          tileCacheBusters.has(fetchRegion.key);

        return (
          !hasFreshTile &&
          shouldFetchByIndex &&
          !inFlightTiles.has(fetchRegion.key)
        );
      })
      .map((fetchRegion) => ({
        ...fetchRegion,
        cacheBuster: tileCacheBusters.get(fetchRegion.key),
      }))
      .slice(0, MAX_TILE_FETCHES_PER_REGION);
  };

  const getFetchRegionsForTileKeys = (tileKeys = []) => {
    return tileKeys
      .map((tileKey) => {
        const tile = parseMapTileKey(tileKey);
        if (!tile || inFlightTiles.has(tile.key)) return null;

        const center = getMapTileCenter(tile);
        return {
          ...tile,
          ...center,
          cacheBuster: tileCacheBusters.get(tile.key),
        };
      })
      .filter(Boolean);
  };

  const markInFlight = (fetchRegions) => {
    fetchRegions.forEach((fetchRegion) => {
      inFlightTiles.add(fetchRegion.key);
    });
  };

  const settleFetchRegions = (fetchRegions) => {
    fetchRegions.forEach((fetchRegion) => {
      inFlightTiles.delete(fetchRegion.key);
    });
  };

  const addFetchResult = ({ fetchRegion, data }) => {
    const nextComplaintIds = new Set();
    const previousComplaintIds = tileComplaintIds.get(fetchRegion.key) || new Set();

    tileCache.set(fetchRegion.key, Date.now());
    tileCacheBusters.delete(fetchRegion.key);
    tileIndex.delete(fetchRegion.key);

    for (const complaint of data) {
      const complaintId = getComplaintId(complaint);
      if (complaintId) {
        const normalizedId = String(complaintId);
        nextComplaintIds.add(normalizedId);
        complaintsCache.set(normalizedId, complaint);
      }
    }

    for (const complaintId of previousComplaintIds) {
      if (!nextComplaintIds.has(complaintId)) {
        complaintsCache.delete(complaintId);
      }
    }

    tileComplaintIds.set(fetchRegion.key, nextComplaintIds);
  };

  const addBatchFetchResults = ({ fetchRegions, tiles }) => {
    const regionsByKey = new Map(
      fetchRegions.map((fetchRegion) => [fetchRegion.key, fetchRegion]),
    );

    tiles.forEach((tileResult) => {
      const fetchRegion = regionsByKey.get(tileResult.tileKey);
      if (!fetchRegion) return;

      addFetchResult({
        fetchRegion,
        data: Array.isArray(tileResult.items) ? tileResult.items : [],
      });
    });
  };

  const addComplaints = (complaints = []) => {
    complaints.forEach((complaint) => {
      const complaintId = getComplaintId(complaint);
      if (!complaintId) return;
      complaintsCache.set(String(complaintId), complaint);
    });
  };

  const invalidateTiles = ({ tileKeys = [], complaintId, action }) => {
    tileKeys.forEach((tileKey) => {
      tileCache.delete(tileKey);
      tileIndex.delete(tileKey);
      tileCacheBusters.set(tileKey, Date.now());
    });

    if (complaintId && action === 'deleted') {
      complaintsCache.delete(String(complaintId));
    }
  };

  const prune = (visibleRegion) => {
    if (complaintsCache.size <= MAX_CACHED_MARKERS) return;

    const visibleComplaints = getNearestComplaints(complaintsCache, visibleRegion).slice(
      0,
      MAX_CACHED_MARKERS,
    );
    complaintsCache.clear();
    visibleComplaints.forEach((complaint) => {
      complaintsCache.set(String(getComplaintId(complaint)), complaint);
    });
  };

  return {
    getVisible,
    setTileIndex,
    markTileIndexUnavailable,
    getMissingFetchRegions,
    getFetchRegionsForTileKeys,
    markInFlight,
    settleFetchRegions,
    addFetchResult,
    addBatchFetchResults,
    addComplaints,
    invalidateTiles,
    prune,
  };
};
