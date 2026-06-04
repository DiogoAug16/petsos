import { apiFetch } from './api';

export const voteOnComplaint = (complaintId, approved) => {
  return apiFetch(`/complaints/${complaintId}/votes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ approved }),
  });
};

export const getVoteStatus = (complaintId) => {
  return apiFetch(`/complaints/${complaintId}/votes/status`);
};
