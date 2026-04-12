import { ComplaintMarker } from '@/components/map/complaint-marker';

export function ComplaintMarkersLayer({
  complaints = [],
  shouldRender = false,
  onMarkerPress = () => {},
}) {
  if (!shouldRender) return null;

  return complaints.map((complaint, index) => {
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
        onPress={() => onMarkerPress(complaintRouteId)}
      />
    );
  });
}
