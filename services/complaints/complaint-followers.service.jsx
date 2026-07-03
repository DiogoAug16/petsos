import { apiFetch } from '@/services/api';

export const followComplaint = (complaintId) => {
  return apiFetch(`/complaint-followers/${complaintId}`, {
    method: 'POST',
  });
};

export const unfollowComplaint = (complaintId) => {
  return apiFetch(`/complaint-followers/${complaintId}`, {
    method: 'DELETE',
  });
};

export const getIsFollowingComplaint = (complaintId) => {
  return apiFetch(`/complaint-followers/${complaintId}/me`);
};

export const getComplaintFollowersCount = (complaintId) => {
  return apiFetch(`/complaint-followers/${complaintId}/count`, {
    skipAuthRedirect: true,
  });
};

export const getComplaintFollowers = (complaintId) => {
  return apiFetch(`/complaint-followers/${complaintId}`, {
    skipAuthRedirect: true,
  });
};
