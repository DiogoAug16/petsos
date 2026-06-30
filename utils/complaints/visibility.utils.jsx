const HIDDEN_VISIBILITY = new Set(['hidden', 'rejected']);

export const isComplaintPubliclyVisible = (complaint) => {
  const visibility = String(complaint?.publicVisibility || '').trim().toLowerCase();
  if (!visibility) return true;
  return !HIDDEN_VISIBILITY.has(visibility);
};

export const filterPubliclyVisibleComplaints = (complaints = []) => {
  if (!Array.isArray(complaints)) return [];
  return complaints.filter(isComplaintPubliclyVisible);
};
