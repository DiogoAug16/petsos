import { apiFetch } from './api';

const toCoordinate = ([longitude, latitude]) => ({ latitude, longitude });

export async function getDrivingRoute(start, end) {
  const params = new URLSearchParams({
    start: `${start.longitude},${start.latitude}`,
    end: `${end.longitude},${end.latitude}`,
  });

  const route = await apiFetch(`/routes/driving?${params}`, {
    skipAuthRedirect: true,
  }).catch(() => null);
  const coordinates = route?.data?.coordinates ?? route?.coordinates;
  if (!Array.isArray(coordinates)) return null;

  return coordinates
    .map(toCoordinate)
    .filter(
      (coordinate) =>
        Number.isFinite(coordinate.latitude) &&
        Number.isFinite(coordinate.longitude),
    );
}
