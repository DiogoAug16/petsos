const ORS_API_KEY = process.env.EXPO_PUBLIC_OPENROUTESERVICE_API_KEY;
const ORS_DIRECTIONS_URL =
  'https://api.openrouteservice.org/v2/directions/driving-car';

const toCoordinate = ([longitude, latitude]) => ({ latitude, longitude });

export async function getDrivingRoute(start, end) {
  if (!ORS_API_KEY) return null;

  const params = new URLSearchParams({
    api_key: ORS_API_KEY,
    geometry_simplify: 'false',
    start: `${start.longitude},${start.latitude}`,
    end: `${end.longitude},${end.latitude}`,
  });

  const response = await fetch(`${ORS_DIRECTIONS_URL}?${params}`, {
    headers: {
      Accept: 'application/json, application/geo+json',
      Authorization: ORS_API_KEY,
    },
  });
  if (!response.ok) return null;

  const data = await response.json();
  const coordinates = data?.features?.[0]?.geometry?.coordinates;
  if (!Array.isArray(coordinates)) return null;

  return coordinates
    .map(toCoordinate)
    .filter(
      (coordinate) =>
        Number.isFinite(coordinate.latitude) &&
        Number.isFinite(coordinate.longitude),
    );
}
