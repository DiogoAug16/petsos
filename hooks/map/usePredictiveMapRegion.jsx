import { useCallback, useRef, useState } from 'react';

const MAP_REGION_UPDATE_THROTTLE_MS = 220;
const MAP_PREFETCH_OVERSCAN = 1.35;
const MAP_PREFETCH_LEAD = 1.2;
const MAP_PREFETCH_MIN_DELTA = 0.12;
const MAP_PREFETCH_MAX_DELTA = 0.34;

const clampDelta = (value) =>
  Math.min(Math.max(value, MAP_PREFETCH_MIN_DELTA), MAP_PREFETCH_MAX_DELTA);

export const usePredictiveMapRegion = () => {
  const lastRegionUpdateRef = useRef(0);
  const lastVisibleRegionRef = useRef(null);
  const [mapRegionState, setMapRegionState] = useState({
    visibleRegion: null,
    prefetchRegion: null,
    movement: { latitude: 0, longitude: 0 },
  });

  const updateRegion = useCallback((nextRegion, { immediate = false } = {}) => {
    if (!nextRegion) return;

    const now = Date.now();
    if (!immediate && now - lastRegionUpdateRef.current < MAP_REGION_UPDATE_THROTTLE_MS) {
      return;
    }

    const previousRegion = lastVisibleRegionRef.current;
    const movement = {
      latitude: nextRegion.latitude - (previousRegion?.latitude ?? nextRegion.latitude),
      longitude: nextRegion.longitude - (previousRegion?.longitude ?? nextRegion.longitude),
    };
    const latitudeLead = previousRegion ? movement.latitude * MAP_PREFETCH_LEAD : 0;
    const longitudeLead = previousRegion ? movement.longitude * MAP_PREFETCH_LEAD : 0;

    lastVisibleRegionRef.current = nextRegion;
    lastRegionUpdateRef.current = now;
    setMapRegionState({
      visibleRegion: nextRegion,
      prefetchRegion: {
        latitude: nextRegion.latitude + latitudeLead,
        longitude: nextRegion.longitude + longitudeLead,
        latitudeDelta: clampDelta(nextRegion.latitudeDelta * MAP_PREFETCH_OVERSCAN),
        longitudeDelta: clampDelta(nextRegion.longitudeDelta * MAP_PREFETCH_OVERSCAN),
      },
      movement,
    });
  }, []);

  return {
    ...mapRegionState,
    updateRegion,
  };
};
