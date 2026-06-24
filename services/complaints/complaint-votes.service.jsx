import { apiFetch } from '@/services/api';

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

export const voteEvidenceSelection = (complaintId, evidenceIds) => {
  return apiFetch(`/complaints/${complaintId}/votes/evidence-selection`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ evidenceIds }),
  });
};

export const getEvidenceSelectionStatus = (complaintId) => {
  return apiFetch(`/complaints/${complaintId}/votes/evidence-selection/status`);
};
