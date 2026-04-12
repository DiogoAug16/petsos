import { CITY_LEVEL_MAX_DELTA } from '@/constants/map.constants';
import { useMemo } from 'react';

export function useVisibleMapComplaints(allComplaints = [], region) {
  const shouldShowComplaintMarkers =
    !region ||
    (region.latitudeDelta <= CITY_LEVEL_MAX_DELTA &&
      region.longitudeDelta <= CITY_LEVEL_MAX_DELTA);

  const validComplaints = useMemo(
    () =>
      (Array.isArray(allComplaints) ? allComplaints : []).filter(
        (complaint) =>
          complaint.location &&
          complaint.location.latitude &&
          complaint.location.longitude &&
          !isNaN(Number(complaint.location.latitude)) &&
          !isNaN(Number(complaint.location.longitude))
      ),
    [allComplaints]
  );

  return { shouldShowComplaintMarkers, validComplaints };
}
