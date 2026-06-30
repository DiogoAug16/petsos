export const getModerationComplaint = (item) => item?.complaint ?? item;

export const getModerationComplaintId = (item) =>
  item?.complaintId ?? getModerationComplaint(item)?.id;

export const getModerationTargetId = (item) =>
  item?.id ?? getModerationComplaintId(item);

export const getLocationFallbackLabel = (location) => {
  const latitude = Number(location?.latitude);
  const longitude = Number(location?.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return 'Localização não informada';
  }

  return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
};
