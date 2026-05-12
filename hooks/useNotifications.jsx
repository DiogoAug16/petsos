import { getNotifications } from '@/services/notifications.service';
import { useCallback, useEffect, useState } from 'react';

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = useCallback(async () => {
    try {
      const response = await getNotifications();

      const data = response?.data || [];

      const visibleNotifications = data.filter(
        (notification) =>
          !(notification.type === 'new_comment' && notification.grouped === true)
      );

      setNotifications(visibleNotifications);
    } catch (error) {
      console.log('Erro ao buscar notificações:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const refresh = useCallback(() => {
    setRefreshing(true);
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  return {
    notifications,
    loading,
    refreshing,
    refresh,
    reload: loadNotifications,
  };
}