import { getNearbyComplaints } from '@/services/complaints/complaints.service';
import { useCallback, useEffect, useState } from 'react';

export function useNearbyComplaints(location, radiusKm = 5) {
  const [nearbyComplaints, setNearbyComplaints] = useState([]);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [errorNearby, setErrorNearby] = useState(null);

  const refetchNearby = useCallback(async () => {
    if (!location?.latitude || !location?.longitude) return;

    try {
      setLoadingNearby(true);
      setErrorNearby(null);

      const response = await getNearbyComplaints(
        location.latitude,
        location.longitude,
        radiusKm
      );

      const data = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
          ? response
          : [];

      const sortedData = [...data].sort(
        (a, b) => (a.distanceKm || 0) - (b.distanceKm || 0)
      );

      setNearbyComplaints(sortedData);
    } catch (error) {
      setErrorNearby(error);
      setNearbyComplaints([]);
    } finally {
      setLoadingNearby(false);
    }
  }, [location, radiusKm]);

  useEffect(() => {
    refetchNearby();
  }, [refetchNearby]);

  return {
    nearbyComplaints,
    loadingNearby,
    errorNearby,
    refetchNearby,
  };
}
