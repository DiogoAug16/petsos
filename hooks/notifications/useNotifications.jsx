import { auth } from '@/config/firebase';
import { getNotifications } from '@/services/notifications/notifications.service';
import { appLogger } from '@/utils/shared/app-logger';
import { readLocalCache, writeLocalCache } from '@/utils/shared/local-cache';
import { useCallback, useEffect, useState } from 'react';

const NOTIFICATIONS_CACHE_MAX_AGE_MS = 60 * 60 * 1000;

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = useCallback(async () => {
    try {
      const cacheKey = auth.currentUser?.uid
        ? `notifications:list:${auth.currentUser.uid}`
        : null;

      if (cacheKey) {
        const cached = await readLocalCache(cacheKey, {
          maxAgeMs: NOTIFICATIONS_CACHE_MAX_AGE_MS,
        });
        if (Array.isArray(cached)) {
          setNotifications(cached);
          setLoading(false);
        }
      }

      const response = await getNotifications();

      const data = response?.data || [];

      const visibleNotifications = data.filter(
        (notification) =>
          !(notification.type === 'new_comment' && notification.grouped === true)
      );

      setNotifications(visibleNotifications);
      if (cacheKey) writeLocalCache(cacheKey, visibleNotifications);
    } catch (error) {
      appLogger.warn('Erro ao buscar notificações', { error });
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
