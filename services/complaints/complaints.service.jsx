import { enqueueComplaintMapTileInvalidation } from '@/utils/map/map-tile-invalidation-store';
import { apiFetch } from '@/services/api';
import { buildImageUploadFile, isLocalMediaUri } from '@/utils/media/image-upload.utils';

const getResponseData = (response) => response?.data ?? response?.complaint ?? response;

export async function getComplaints({ signal, cursor, limit = 50 } = {}) {
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor) params.set('cursor', cursor);

  const result = await apiFetch(`/complaints?${params}`, {
    signal,
    skipAuthRedirect: true,
  });

  if (Array.isArray(result)) {
    return {
      items: result,
      pageInfo: {
        limit,
        hasMore: false,
        nextCursor: null,
        totalItems: result.length,
      },
    };
  }

  const data = result?.data ?? result;
  const items = Array.isArray(data?.items) ? data.items : [];
  return {
    items,
    pageInfo: data?.pageInfo ?? {
      limit,
      hasMore: false,
      nextCursor: null,
      totalItems: items.length,
    },
  };
}

//Envio do Formulario de criação de denúncia para o backend
export async function createComplaint(data) {
  const formData = new FormData();

  // Campos básicos da denúncia
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("type", data.type);
  formData.append("animal", data.animal);
  formData.append("status", data.status);
  formData.append("location", JSON.stringify(data.location));

  const convertedPhotos = await Promise.all(
    (Array.isArray(data.photos) ? data.photos : []).map(async (uri, index) => {
      return buildImageUploadFile(uri, `foto_${index}.jpg`);
    }),
  );

  convertedPhotos.forEach((photo) => {
    formData.append("photos", photo);
  });

  const response = await apiFetch("/complaints", {
    method: "POST",
    body: formData,
  });
  const complaint = getResponseData(response);

  enqueueComplaintMapTileInvalidation({
    complaint,
    action: 'created',
  });

  return response;
}

export async function getComplaintById(id, signal) {
  return await apiFetch(`/complaints/${id}`, { signal, skipAuthRedirect: true });
}

export async function deleteComplaint(id) {
  return await apiFetch(`/complaints/${id}`, { method: "DELETE" });
}

export async function updateComplaint(id, data) {
  const hasPhotosField = Array.isArray(data.photos);

  const payload = {
    title: data.title,
    description: data.description,
    type: data.type,
    animal: data.animal,
    status: data.status,
    photos: hasPhotosField ? data.photos.filter((photo) => Boolean(photo)) : undefined,
    location: data.location
      ? {
          latitude: Number(data.location.latitude),
          longitude: Number(data.location.longitude),
        }
      : undefined,
  };

  const localPhotos =
    hasPhotosField && Array.isArray(payload.photos)
      ? payload.photos.filter((photo) => isLocalMediaUri(photo))
      : [];

  const existingPhotos =
    hasPhotosField && Array.isArray(payload.photos)
      ? payload.photos.filter((photo) => !isLocalMediaUri(photo))
      : [];

  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("description", payload.description);
  formData.append("type", payload.type);
  formData.append("animal", payload.animal);

  if (payload.status !== undefined) {
    formData.append("status", payload.status);
  }

  if (payload.location) {
    formData.append("location", JSON.stringify(payload.location));
  }

  if (hasPhotosField) {
    formData.append("existingPhotos", JSON.stringify(existingPhotos));
  }

  if (localPhotos.length > 0) {
    const convertedPhotos = await Promise.all(
      localPhotos.map(async (uri, index) => {
        return buildImageUploadFile(uri, `foto_editada_${index}.jpg`);
      }),
    );

    convertedPhotos.forEach((photo) => {
      formData.append("photos", photo);
    });
  }

  const response = await apiFetch(`/complaints/${id}`, {
    method: "PATCH",
    body: formData,
  });
  const complaint = getResponseData(response);

  enqueueComplaintMapTileInvalidation({
    complaint,
    action: 'updated',
    complaintId: id,
  });

  return response;
}

export async function updateComplaintStatus(id, status) {
  return apiFetch(`/complaints/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}

export async function getNearbyComplaints(lat, lng, radiusKm = 5) {
  return apiFetch(`/complaints/nearest?lat=${lat}&lng=${lng}&radiusKm=${radiusKm}`, {
    skipAuthRedirect: true,
  });
}

export async function getMapComplaints(region, signal) {
  if (!region) return [];

  if (
    Number.isInteger(region.tileZ) &&
    Number.isInteger(region.tileX) &&
    Number.isInteger(region.tileY)
  ) {
    const params = new URLSearchParams({
      z: String(region.tileZ),
      x: String(region.tileX),
      y: String(region.tileY),
      limit: '120',
    });

    if (region.cacheBuster) {
      params.set('_v', String(region.cacheBuster));
    }

    const response = await apiFetch(`/complaints/map/tile?${params}`, {
      signal,
      skipAuthRedirect: true,
    });
    const data = response?.data ?? response;
    return Array.isArray(data) ? data : [];
  }

  const north = Number(region.latitude) + Number(region.latitudeDelta) / 2;
  const south = Number(region.latitude) - Number(region.latitudeDelta) / 2;
  const east = Number(region.longitude) + Number(region.longitudeDelta) / 2;
  const west = Number(region.longitude) - Number(region.longitudeDelta) / 2;
  const params = new URLSearchParams({
    north: String(north),
    south: String(south),
    east: String(east),
    west: String(west),
    limit: '120',
  });
  const response = await apiFetch(`/complaints/map?${params}`, {
    signal,
    skipAuthRedirect: true,
  });
  const data = response?.data ?? response;
  return Array.isArray(data) ? data : [];
}

export async function getMapTileHints({ lat, lng, radiusKm = 10, z = 12 }, signal) {
  const params = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
    radiusKm: String(radiusKm),
    z: String(z),
  });

  const response = await apiFetch(`/complaints/map/tiles-index?${params}`, {
    signal,
    skipAuthRedirect: true,
  });
  const data = response?.data ?? response;
  return Array.isArray(data?.items) ? data.items : [];
}

export async function requestComplaintValidation(id, { reasonType, reasonText, evidenceIds }) {
  return apiFetch(`/complaints/${id}/request-validation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reasonType, reasonText, evidenceIds }),
  });
}
