import * as Location from 'expo-location';

const cache = new Map();

const pending = new Map();

function buildCacheKey(latitude, longitude) {
  return `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
}

export async function getAddressFromCoords(latitude, longitude) {
  const key = buildCacheKey(latitude, longitude);

  if (cache.has(key)) {
    return cache.get(key);
  }

  if (pending.has(key)) {
    return pending.get(key);
  }

  const promise = (async () => {
    try {
      const results = await Location.reverseGeocodeAsync(
        { latitude, longitude },
      );

      const address = formatAddress(results[0]) ?? formatCoords(latitude, longitude);

      cache.set(key, address);
      return address;
    } catch {
      const fallback = formatCoords(latitude, longitude);
      cache.set(key, fallback);
      return fallback;
    } finally {
      pending.delete(key);
    }
  })();

  pending.set(key, promise);
  return promise;
}

export function clearAddressCache() {
  cache.clear();
  pending.clear();
}

export function invalidateAddressCache(latitude, longitude) {
  const key = buildCacheKey(latitude, longitude);
  cache.delete(key);
  pending.delete(key);
}

function formatAddress(geo) {
  if (!geo) return null;

  const parts = [
    geo.street,
    geo.streetNumber,
    geo.district,
    geo.city,
    geo.region,
  ].filter(Boolean);

  return parts.join(', ') || null;
}

export function formatCoords(latitude, longitude) {
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
}