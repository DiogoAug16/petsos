import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useMemo } from 'react';

export function useMapFocusRegion({
  focusLat,
  focusLng,
  mapReady,
  mapRef,
  onFocus,
}) {
  const focusRegion = useMemo(() => {
    const latitude = Number(Array.isArray(focusLat) ? focusLat[0] : focusLat);
    const longitude = Number(Array.isArray(focusLng) ? focusLng[0] : focusLng);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
    return {
      latitude,
      longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };
  }, [focusLat, focusLng]);

  const focusCoordinate = focusRegion
    ? { latitude: focusRegion.latitude, longitude: focusRegion.longitude }
    : null;

  const focusMapOnComplaint = useCallback(() => {
    if (!focusRegion || !mapReady) return;
    mapRef.current?.animateToRegion(focusRegion, 600);
  }, [focusRegion, mapReady, mapRef]);

  useFocusEffect(
    useCallback(() => {
      onFocus?.();
      const timer = setTimeout(focusMapOnComplaint, 80);
      return () => clearTimeout(timer);
    }, [focusMapOnComplaint, onFocus]),
  );

  useEffect(() => {
    focusMapOnComplaint();
  }, [focusMapOnComplaint]);

  return { focusCoordinate };
}
