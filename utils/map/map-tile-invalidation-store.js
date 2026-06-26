import { getMapTile } from '@/utils/map/map-marker-cache';

const pendingInvalidations = [];
const listeners = new Set();

export const enqueueMapTileInvalidation = (payload) => {
  if (!payload?.tileKeys?.length) return;

  const invalidation = {
    ...payload,
    timestamp: payload.timestamp ?? Date.now(),
  };

  if (listeners.size === 0) {
    pendingInvalidations.push(invalidation);
  }

  listeners.forEach((listener) => listener(invalidation));
};

export const enqueueComplaintMapTileInvalidation = ({
  complaint,
  action,
  complaintId,
}) => {
  const latitude = Number(complaint?.location?.latitude);
  const longitude = Number(complaint?.location?.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;

  enqueueMapTileInvalidation({
    type: 'map_tiles_invalidated',
    tileKeys: [getMapTile(latitude, longitude).key],
    complaintId: complaintId ?? complaint?.id ?? complaint?._id,
    action,
  });
};

export const drainMapTileInvalidations = () => {
  return pendingInvalidations.splice(0, pendingInvalidations.length);
};

export const subscribeMapTileInvalidations = (listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
