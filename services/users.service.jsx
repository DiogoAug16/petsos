import { apiFetch } from './api';

const unwrapData = (response) => response?.data ?? response;

export async function getCurrentUserProfile() {
  const response = await apiFetch('/users/me');
  return unwrapData(response);
}

export async function getPublicUserProfile(username) {
  const response = await apiFetch(`/users/${encodeURIComponent(username)}`);
  return unwrapData(response);
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
