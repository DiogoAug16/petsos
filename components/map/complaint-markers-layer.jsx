import { ComplaintMarker } from '@/components/map/complaint-marker';

const MAX_MARKERS = 150;

export function ComplaintMarkersLayer({
  complaints = [],
  shouldRender = false,
  onMarkerPress = () => {},
}) {
  if (!shouldRender) return null;

  return complaints.slice(0, MAX_MARKERS).map((complaint, index) => {
    const complaintId = complaint?.id ?? complaint?._id;
    const markerKey =
      complaintId !== undefined && complaintId !== null
        ? String(complaintId)
        : `complaint-marker-${index}`;
    const complaintRouteId =
      complaintId !== undefined && complaintId !== null
        ? String(complaintId)
        : null;

    return (
      <ComplaintMarker
        key={markerKey}
        complaint={complaint}
        onPress={() => onMarkerPress(complaint, complaintRouteId)}
      />
    );
  });
}
