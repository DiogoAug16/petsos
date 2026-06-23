import { apiFetch } from './api';

export const getNotifications = () => {
  return apiFetch('/notifications', {
    method: 'GET',
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
  });
};

export const markNotificationAsRead = (notificationId) => {
  return apiFetch(`/notifications/${notificationId}/read`, {
    method: 'PATCH',
  });
};

export const clearNotifications = () => {
  return apiFetch('/notifications', {
    method: 'DELETE',
  });
};

export const getUnreadCount = () => {
  return apiFetch('/notifications/unread-count');
};
