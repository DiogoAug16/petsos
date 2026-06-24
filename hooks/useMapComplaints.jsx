import { CITY_LEVEL_MAX_DELTA, MAP_PREFETCH_MAX_DELTA } from '@/constants/map.constants';
import { getMapComplaints } from '@/services/complaints.service';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const MAP_FETCH_DEBOUNCE_MS = 40;
const MAX_CACHED_MARKERS = 500;
const MAX_RENDERED_MARKERS = 150;
const MAX_TILE_FETCHES_PER_REGION = 9;
const TILE_CACHE_TTL_MS = 2 * 60 * 1000;
const TILE_QUERY_OVERLAP = 0.75;
const TILE_MIN_DELTA = 0.07;
const TILE_OVERSCAN = 1.35;

const getComplaintId = (complaint) => complaint?.id ?? complaint?._id;

const clampQueryDelta = (value) =>
  Math.min(Math.max(value, TILE_MIN_DELTA), MAP_PREFETCH_MAX_DELTA);

const getVisibleRegion = (region) => {
  if (!region) return null;

  return {
    latitude: region.visibleLatitude ?? region.latitude,
    longitude: region.visibleLongitude ?? region.longitude,
    latitudeDelta: region.visibleLatitudeDelta ?? region.latitudeDelta,
    longitudeDelta: region.visibleLongitudeDelta ?? region.longitudeDelta,
  };
};

const getDistanceFromRegion = (complaint, region) => {
  const latitude = Number(complaint?.location?.latitude);
  const longitude = Number(complaint?.location?.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || !region) {
    return Number.POSITIVE_INFINITY;
  }

  return Math.abs(latitude - region.latitude) + Math.abs(longitude - region.longitude);
};

const getVisibleComplaints = (cache, region) => {
  return [...cache.values()]
    .sort((first, second) => {
      return getDistanceFromRegion(first, region) - getDistanceFromRegion(second, region);
    })
    .slice(0, MAX_RENDERED_MARKERS);
};

const getTileKey = (latitude, longitude, latitudeDelta, longitudeDelta) => {
  const latStep = latitudeDelta * TILE_QUERY_OVERLAP;
  const lngStep = longitudeDelta * TILE_QUERY_OVERLAP;
  const latBucket = Math.round(latitude / latStep);
  const lngBucket = Math.round(longitude / lngStep);

  return [
    latBucket,
    lngBucket,
    Number(latitudeDelta).toFixed(3),
    Number(longitudeDelta).toFixed(3),
  ].join(':');
};

const buildFetchRegions = (region) => {
  const visibleRegion = getVisibleRegion(region);
  if (!visibleRegion) return [];

  const latitudeDelta = clampQueryDelta(visibleRegion.latitudeDelta * TILE_OVERSCAN);
  const longitudeDelta = clampQueryDelta(visibleRegion.longitudeDelta * TILE_OVERSCAN);
  const latitudeStep = latitudeDelta * TILE_QUERY_OVERLAP;
  const longitudeStep = longitudeDelta * TILE_QUERY_OVERLAP;
  const movementLatitude = Number(region?.movementLatitude || 0);
  const movementLongitude = Number(region?.movementLongitude || 0);
  const directionLatitude = Math.sign(movementLatitude);
  const directionLongitude = Math.sign(movementLongitude);
  const offsets = [];
  const seen = new Set();

  const addOffset = (latitudeOffset, longitudeOffset, priority) => {
    const key = `${latitudeOffset}:${longitudeOffset}`;
    if (seen.has(key)) return;
    seen.add(key);
    offsets.push({ latitudeOffset, longitudeOffset, priority });
  };

  addOffset(0, 0, 0);

  if (directionLatitude || directionLongitude) {
    addOffset(directionLatitude, directionLongitude, -3);
    addOffset(directionLatitude * 2, directionLongitude * 2, -2);
    addOffset(directionLatitude || 0, 0, -1);
    addOffset(0, directionLongitude || 0, -1);
  }

  for (let latitudeOffset = -1; latitudeOffset <= 1; latitudeOffset += 1) {
    for (let longitudeOffset = -1; longitudeOffset <= 1; longitudeOffset += 1) {
      addOffset(
        latitudeOffset,
        longitudeOffset,
        Math.abs(latitudeOffset) + Math.abs(longitudeOffset)
      );
    }
  }

  return offsets
    .sort((first, second) => first.priority - second.priority)
    .map(({ latitudeOffset, longitudeOffset }) => {
      const latitude = visibleRegion.latitude + latitudeOffset * latitudeStep;
      const longitude = visibleRegion.longitude + longitudeOffset * longitudeStep;

      return {
        key: getTileKey(latitude, longitude, latitudeDelta, longitudeDelta),
        latitude,
        longitude,
        latitudeDelta,
        longitudeDelta,
      };
    });
};

export function useMapComplaints(region) {
  const [complaints, setComplaints] = useState([]);
  const hasFetchedRef = useRef(false);
  const latestRequestRef = useRef(0);
  const latestRegionRef = useRef(region);
  const complaintsCacheRef = useRef(new Map());
  const tileCacheRef = useRef(new Map());
  const inFlightTilesRef = useRef(new Set());
  const visibleLatitudeDelta = region?.visibleLatitudeDelta ?? region?.latitudeDelta;
  const visibleLongitudeDelta = region?.visibleLongitudeDelta ?? region?.longitudeDelta;
  const shouldFetch =
    region &&
    visibleLatitudeDelta <= CITY_LEVEL_MAX_DELTA &&
    visibleLongitudeDelta <= CITY_LEVEL_MAX_DELTA &&
    region.latitudeDelta <= MAP_PREFETCH_MAX_DELTA &&
    region.longitudeDelta <= MAP_PREFETCH_MAX_DELTA;

  const regionKey = useMemo(() => {
    if (!shouldFetch) return null;
    return [
      Number(region.latitude).toFixed(3),
      Number(region.longitude).toFixed(3),
      Number(region.latitudeDelta).toFixed(3),
      Number(region.longitudeDelta).toFixed(3),
    ].join(':');
  }, [region, shouldFetch]);

  useEffect(() => {
    latestRegionRef.current = region;
    if (complaintsCacheRef.current.size > 0) {
      setComplaints(
        getVisibleComplaints(complaintsCacheRef.current, getVisibleRegion(region))
      );
    }
  }, [region]);

  const refetch = useCallback(
    async () => {
      const requestId = latestRequestRef.current + 1;
      latestRequestRef.current = requestId;

      if (!shouldFetch) {
        return;
      }

      const now = Date.now();
      const fetchRegions = buildFetchRegions(region).filter((fetchRegion) => {
        const cachedAt = tileCacheRef.current.get(fetchRegion.key);
        return (
          (!cachedAt || now - cachedAt > TILE_CACHE_TTL_MS) &&
          !inFlightTilesRef.current.has(fetchRegion.key)
        );
      });

      if (fetchRegions.length === 0) {
        setComplaints(
          getVisibleComplaints(complaintsCacheRef.current, getVisibleRegion(latestRegionRef.current))
        );
        return;
      }

      const pendingRegions = fetchRegions.slice(0, MAX_TILE_FETCHES_PER_REGION);
      pendingRegions.forEach((fetchRegion) => {
        inFlightTilesRef.current.add(fetchRegion.key);
      });

      const responses = await Promise.allSettled(
        pendingRegions.map(async (fetchRegion) => {
          const data = await getMapComplaints(fetchRegion);
          return { fetchRegion, data };
        })
      );

      responses.forEach((response) => {
        if (response.status !== 'fulfilled') return;

        const { fetchRegion, data } = response.value;
        tileCacheRef.current.set(fetchRegion.key, Date.now());

        for (const complaint of data) {
          const complaintId = getComplaintId(complaint);
          if (complaintId) complaintsCacheRef.current.set(String(complaintId), complaint);
        }
      });

      pendingRegions.forEach((fetchRegion) => {
        inFlightTilesRef.current.delete(fetchRegion.key);
      });

      if (complaintsCacheRef.current.size > MAX_CACHED_MARKERS) {
        const latestRegion = getVisibleRegion(latestRegionRef.current);
        complaintsCacheRef.current = new Map(
          getVisibleComplaints(complaintsCacheRef.current, latestRegion).map((complaint) => [
            String(getComplaintId(complaint)),
            complaint,
          ])
        );
      }

      if (requestId <= latestRequestRef.current) {
        setComplaints(
          getVisibleComplaints(complaintsCacheRef.current, getVisibleRegion(latestRegionRef.current))
        );
      }
    },
    [region, shouldFetch]
  );

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
