import { getNearbyComplaints } from '@/services/complaints.service';
import { useEffect, useState } from 'react';

export function useNearbyComplaints(location, radiusKm = 5) {
  const [nearbyComplaints, setNearbyComplaints] = useState([]);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [errorNearby, setErrorNearby] = useState(null);

  useEffect(() => {
    if (!location?.latitude || !location?.longitude) return;

    async function loadNearbyComplaints() {
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

        setNearbyComplaints(data);
      } catch (error) {
        console.error('Erro ao buscar denúncias próximas:', error);
        setErrorNearby(error);
        setNearbyComplaints([]);
      } finally {
        setLoadingNearby(false);
      }
    }

    loadNearbyComplaints();
  }, [location, radiusKm]);

  return {
    nearbyComplaints,
    loadingNearby,
    errorNearby,
  };
}