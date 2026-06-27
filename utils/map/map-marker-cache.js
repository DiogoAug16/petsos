import { MAP_PREFETCH_MAX_DELTA } from '@/constants/map/map.constants';

const MAX_CACHED_MARKERS = 500;
const MAX_VISIBLE_TILE_HINTS = 80;
const MAX_RENDERED_MARKERS = 150;
const MAX_TILE_FETCHES_PER_REGION = 4;
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

export const getMapTileCenter = (tile) => {
  const bounds = getMapTileBounds(tile);
  return {
    latitude: (bounds.north + bounds.south) / 2,
    longitude: (bounds.east + bounds.west) / 2,
  };
};

const normalizeTileHint = (hint) => {
  const z = Number(hint?.z);
  const x = Number(hint?.x);
  const y = Number(hint?.y);
  const count = Number(hint?.count ?? 0);

  if (!Number.isInteger(z) || !Number.isInteger(x) || !Number.isInteger(y) || count <= 0) {
    return null;
  }

  const key = hint.tileKey || `${z}:${x}:${y}`;
  const tile = { key, tileZ: z, tileX: x, tileY: y };
  const coordinate = getMapTileCenter(tile);

  return {
    ...hint,
    ...tile,
    count,
    coordinate,
  };
};

const regionContainsCoordinate = (region, coordinate) => {
  if (!region || !coordinate) return false;

  const latitudeDelta = Number(region.latitudeDelta || 0);
  const longitudeDelta = Number(region.longitudeDelta || 0);
  const north = Number(region.latitude) + latitudeDelta / 2;
  const south = Number(region.latitude) - latitudeDelta / 2;
  const east = Number(region.longitude) + longitudeDelta / 2;
  const west = Number(region.longitude) - longitudeDelta / 2;

  return (
    coordinate.latitude <= north &&
    coordinate.latitude >= south &&
    coordinate.longitude <= east &&
    coordinate.longitude >= west
  );
};

const getTileCoordinates = (tile) => {
  const bounds = getMapTileBounds(tile);
  return [
    { latitude: bounds.north, longitude: bounds.west },
    { latitude: bounds.north, longitude: bounds.east },
    { latitude: bounds.south, longitude: bounds.east },
    { latitude: bounds.south, longitude: bounds.west },
  ];
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

  const visibleTile = getMapTile(visibleRegion.latitude, visibleRegion.longitude);
  const visibleFetchRegion = {
    ...visibleTile,
    latitude: visibleRegion.latitude,
    longitude: visibleRegion.longitude,
    latitudeDelta,
    longitudeDelta,
  };

  return [visibleFetchRegion, ...offsets
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
      };
    })]
    .filter((fetchRegion) => {
      if (seenTiles.has(fetchRegion.key)) return false;
      seenTiles.add(fetchRegion.key);
      return true;
    });
};

export const buildDebugTiles = ({ visibleRegion, prefetchRegion, movement }) => {
  if (!visibleRegion || !prefetchRegion) return [];

  const activeTile = getMapTile(visibleRegion.latitude, visibleRegion.longitude);
  const tilesByKey = new Map();

  for (const tile of [activeTile, ...buildFetchRegions({ visibleRegion, prefetchRegion, movement })]) {
    tilesByKey.set(tile.key, {
      key: tile.key,
      coordinates: getTileCoordinates(tile),
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
  const tileHints = new Map();
  const inFlightTiles = new Set();
  let tileHintsReady = false;

  const getVisible = (region) => getVisibleComplaints(complaintsCache, region);

  const getVisibleTileHints = (region) => {
    return [...tileHints.values()]
      .filter((hint) => {
        if (tileComplaintIds.has(hint.key)) return false;
        return regionContainsCoordinate(region, hint.coordinate);
      })
      .sort((first, second) => second.count - first.count)
      .slice(0, MAX_VISIBLE_TILE_HINTS);
  };

  const setTileHints = (hints = []) => {
    tileHintsReady = true;
    hints.forEach((hint) => {
      const normalized = normalizeTileHint(hint);
      if (!normalized) return;
      tileHints.set(normalized.key, normalized);
    });
  };

  const markTileHintsUnavailable = () => {
    tileHintsReady = false;
  };

  const getMissingFetchRegions = (params) => {
    const now = Date.now();
    return buildFetchRegions(params)
      .filter((fetchRegion) => {
        const cachedAt = tileCache.get(fetchRegion.key);
        const hasFreshTile = cachedAt && now - cachedAt <= TILE_CACHE_TTL_MS;
        const hint = tileHints.get(fetchRegion.key);
        const shouldFetchByHint =
          !tileHintsReady || Boolean(hint) || tileCacheBusters.has(fetchRegion.key);

        return (
          !hasFreshTile &&
          shouldFetchByHint &&
          !inFlightTiles.has(fetchRegion.key)
        );
      })
      .map((fetchRegion) => ({
        ...fetchRegion,
        cacheBuster: tileCacheBusters.get(fetchRegion.key),
      }))
      .slice(0, MAX_TILE_FETCHES_PER_REGION);
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
    tileHints.delete(fetchRegion.key);

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

  const invalidateTiles = ({ tileKeys = [], complaintId, action }) => {
    tileKeys.forEach((tileKey) => {
      tileCache.delete(tileKey);
      tileHints.delete(tileKey);
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
    getVisibleTileHints,
    setTileHints,
    markTileHintsUnavailable,
    getMissingFetchRegions,
    markInFlight,
    settleFetchRegions,
    addFetchResult,
    invalidateTiles,
    prune,
  };
};
