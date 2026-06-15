import { apiFetch } from './api';

export const volunteerForComplaint = (complaintId) => {
  return apiFetch(`/complaint-volunteers/${complaintId}`, {
    method: 'POST',
  });
};

export const unvolunteerFromComplaint = (complaintId) => {
  return apiFetch(`/complaint-volunteers/${complaintId}`, {
    method: 'DELETE',
  });
};

export const getIsVolunteer = (complaintId) => {
  return apiFetch(`/complaint-volunteers/${complaintId}/me`);
};

export const getVolunteersCount = (complaintId) => {
  return apiFetch(`/complaint-volunteers/${complaintId}/count`);
};

export const getComplaintVolunteers = (complaintId) => {
  return apiFetch(`/complaint-volunteers/${complaintId}`);
};
