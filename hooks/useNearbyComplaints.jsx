import { getNearbyComplaints } from '@/services/complaints.service';
import { useCallback, useEffect, useState } from 'react'; // 🔥 ADD

export function useNearbyComplaints(location, radiusKm = 5) {
  const [nearbyComplaints, setNearbyComplaints] = useState([]);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [errorNearby, setErrorNearby] = useState(null);

    //  CRIA FUNÇÃO DE REFETCH
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

      //  OPCIONAL (recomendado): ordenar por distância
      const sortedData = [...data].sort(
        (a, b) => (a.distanceKm || 0) - (b.distanceKm || 0)
      );

      setNearbyComplaints(sortedData);
    } catch (error) {
      console.error('Erro ao buscar denúncias próximas:', error);
      setErrorNearby(error);
      setNearbyComplaints([]);
    } finally {
      setLoadingNearby(false);
    }
  }, [location, radiusKm]);

  //  usa a função no useEffect
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