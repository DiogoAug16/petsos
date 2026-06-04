import { apiFetch } from './api';

export const submitEvidence = (complaintId, formData) => {
  return apiFetch(`/complaints/${complaintId}/evidences`, {
    method: 'POST',
    body: formData,
  });
};

export const getEvidences = (complaintId) => {
  return apiFetch(`/complaints/${complaintId}/evidences`);
};

export const validateEvidence = (complaintId, { approved, evidenceIds }) => {
  return apiFetch(`/complaints/${complaintId}/evidences/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ approved, evidenceIds }),
  });
};
