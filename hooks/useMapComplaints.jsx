import { CITY_LEVEL_MAX_DELTA } from '@/constants/map.constants';
import { getMapComplaints } from '@/services/complaints.service';
import { useCallback, useEffect, useMemo, useState } from 'react';

export function useMapComplaints(region) {
  const [complaints, setComplaints] = useState([]);
  const shouldFetch =
    region &&
    region.latitudeDelta <= CITY_LEVEL_MAX_DELTA &&
    region.longitudeDelta <= CITY_LEVEL_MAX_DELTA;

  const regionKey = useMemo(() => {
    if (!shouldFetch) return null;
    return [
      Number(region.latitude).toFixed(4),
      Number(region.longitude).toFixed(4),
      Number(region.latitudeDelta).toFixed(4),
      Number(region.longitudeDelta).toFixed(4),
    ].join(':');
  }, [region, shouldFetch]);

  const refetch = useCallback(
    async (signal) => {
      if (!shouldFetch) {
        setComplaints([]);
        return;
      }

      const data = await getMapComplaints(region, signal);
      setComplaints(data);
    },
    [region, shouldFetch]
  );

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      refetch(controller.signal).catch((error) => {
        if (error.name !== 'AbortError') setComplaints([]);
      });
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [refetch, regionKey]);

  return {
    complaints,
    shouldShowComplaintMarkers: Boolean(shouldFetch),
    refetchMapComplaints: refetch,
  };
}
