import { apiFetch } from '@/services/api';
import { buildImageUploadFile, isLocalMediaUri } from '@/utils/media/image-upload.utils';

const unwrapData = (response) => response?.data ?? response;

export async function getCurrentUserProfile() {
  const response = await apiFetch('/users/me');
  return unwrapData(response);
}

export async function getCurrentUserProfileSummary() {
  const response = await apiFetch('/users/me/summary');
  const data = unwrapData(response);
  return {
    profile: data?.profile ?? null,
    followedSummary: {
      total: Number(data?.followedSummary?.total ?? 0),
      resolved: Number(data?.followedSummary?.resolved ?? 0),
    },
    unreadNotifications: Number(data?.unreadNotifications ?? 0),
  };
}

export async function getPublicUserProfile(username) {
  const response = await apiFetch(`/users/${encodeURIComponent(username)}`);
  return unwrapData(response);
}

export async function getPublicUserProfileSummary(username) {
  const response = await apiFetch(
    `/users/${encodeURIComponent(username)}/profile-summary`
  );
  const data = unwrapData(response);
  return {
    profile: data?.profile ?? null,
    followedSummary: {
      total: Number(data?.followedSummary?.total ?? 0),
      resolved: Number(data?.followedSummary?.resolved ?? 0),
    },
  };
}

export async function getUserFollowedComplaints(username) {
  const response = await apiFetch(
    `/users/${encodeURIComponent(username)}/followed-complaints`
  );
  const data = unwrapData(response);
  return Array.isArray(data) ? data : [];
}

export async function getUserFollowedComplaintsSummary(username) {
  const response = await apiFetch(
    `/users/${encodeURIComponent(username)}/followed-complaints/summary`
  );
  const data = unwrapData(response);
  return {
    total: Number(data?.total ?? 0),
    resolved: Number(data?.resolved ?? 0),
  };
}

export async function updateCurrentUserProfile({
  name,
  locationLabel,
  description,
  photoUri,
}) {
  const formData = new FormData();
  formData.append('name', name.trim());
  formData.append('locationLabel', locationLabel.trim());
  formData.append('description', description.trim());

  if (photoUri && isLocalMediaUri(photoUri)) {
    const photo = await buildImageUploadFile(photoUri, 'perfil.jpg');
    formData.append('photo', photo);
  }

  const response = await apiFetch('/users/me', {
    method: 'PATCH',
    body: formData,
  });

  return unwrapData(response);
}
