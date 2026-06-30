import { apiFetch } from '@/services/api';

const buildCommentsQuery = ({ limit, cursor }) => {
  const params = [`limit=${limit}`];

  if (cursor) {
    params.push(`cursor=${encodeURIComponent(cursor)}`);
  }

  return params.join('&');
};

export const getComplaintComments = (complaintId, { limit = 10, cursor } = {}) => {
  const query = buildCommentsQuery({ limit, cursor });
  return apiFetch(`/complaints/${complaintId}/comments?${query}`);
};

export const createComplaintComment = (complaintId, text) => {
  return apiFetch(`/complaints/${complaintId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
};

export const getCommentReplies = (
  complaintId,
  commentId,
  { limit = 10, cursor } = {}
) => {
  const query = buildCommentsQuery({ limit, cursor });
  return apiFetch(`/complaints/${complaintId}/comments/${commentId}/replies?${query}`);
};

export const createCommentReply = (complaintId, commentId, text) => {
  return apiFetch(`/complaints/${complaintId}/comments/${commentId}/replies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
};

export const likeComment = (complaintId, commentId) => {
  return apiFetch(`/complaints/${complaintId}/comments/${commentId}/likes`, {
    method: 'POST',
  });
};

export const unlikeComment = (complaintId, commentId) => {
  return apiFetch(`/complaints/${complaintId}/comments/${commentId}/likes`, {
    method: 'DELETE',
  });
};

export const reportComment = (complaintId, commentId, reason = null) => {
  return apiFetch(`/complaints/${complaintId}/comments/${commentId}/report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reason }),
  });
};
