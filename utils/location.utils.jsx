import * as Location from 'expo-location';

const cache = new Map();

const pending = new Map();

function buildCacheKey(latitude, longitude) {
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return null;
  }
  return `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
}

export async function getAddressFromCoords(latitude, longitude) {
  const key = buildCacheKey(latitude, longitude);

  if (key && cache.has(key)) {
    return cache.get(key);
  }

  if (key && pending.has(key)) {
    return pending.get(key);
  }

  const promise = (async () => {
    try {
      const results = await Location.reverseGeocodeAsync(
        { latitude, longitude },
      );

      const address = formatAddress(results[0]) ?? formatCoords(latitude, longitude);

      if (key) cache.set(key, address);
      return address;
    } catch {
      const fallback = formatCoords(latitude, longitude);
      if (key) cache.set(key, fallback);
      return fallback;
    } finally {
      if (key) pending.delete(key);
    }
  })();

  if (key) pending.set(key, promise);
  return promise;
}

export function clearAddressCache() {
  cache.clear();
  pending.clear();
}

export function invalidateAddressCache(latitude, longitude) {
  const key = buildCacheKey(latitude, longitude);
  if (key) {
    cache.delete(key);
    pending.delete(key);
  }
}

function formatAddress(geo) {
  if (!geo) return null;

  const parts = [
    geo.street,
    geo.streetNumber,
    geo.district,
    geo.subregion,
    geo.city,
    geo.region,
  ].filter(Boolean);

  if (parts.length === 0) return null;

  return parts.length > 3 ? parts.slice(0, 3).join(', ') : parts.join(', ');
}

export function formatCoords(latitude, longitude) {
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return 'Localização desconhecida';
  }
  return 'Localização aproximada';
}