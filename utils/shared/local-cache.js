import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = '@petsos:cache:';

const getStorageKey = (key) => `${CACHE_PREFIX}${key}`;

export async function readLocalCache(key, { maxAgeMs } = {}) {
  try {
    const raw = await AsyncStorage.getItem(getStorageKey(key));
    if (!raw) return null;

    const entry = JSON.parse(raw);
    if (!entry || typeof entry !== 'object') return null;

    if (maxAgeMs && Date.now() - Number(entry.updatedAt ?? 0) > maxAgeMs) {
      return null;
    }

    return entry.value ?? null;
  } catch {
    return null;
  }
}

export async function writeLocalCache(key, value) {
  try {
    await AsyncStorage.setItem(
      getStorageKey(key),
      JSON.stringify({
        value,
        updatedAt: Date.now(),
      })
    );
  } catch {
    // Cache failures must never block the app flow.
  }
}

export async function removeLocalCache(key) {
  try {
    await AsyncStorage.removeItem(getStorageKey(key));
  } catch {
    // Cache failures must never block the app flow.
  }
}
