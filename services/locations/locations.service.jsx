import { apiFetch } from '@/services/api';

const unwrapData = (response) => response?.data ?? response;

export async function searchCityLocations(query, { signal, limit = 5 } = {}) {
  const params = new URLSearchParams({
    query: query.trim(),
    limit: String(limit),
  });

  const response = await apiFetch(`/locations/cities?${params}`, {
    signal,
    skipAuthRedirect: true,
  });

  const data = unwrapData(response);
  return Array.isArray(data) ? data : [];
}
