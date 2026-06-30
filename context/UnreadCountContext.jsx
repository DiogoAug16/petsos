import { auth } from '@/config/firebase';
import { useAuth } from '@/context/AuthContext';
import { getAppBootstrap } from '@/services/app/bootstrap.service';
import { getUnreadCount } from '@/services/notifications/notifications.service';
import { appLogger } from '@/utils/shared/app-logger';
import { readLocalCache, writeLocalCache } from '@/utils/shared/local-cache';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

const POLLING_INTERVAL = 30000;
const UNREAD_CACHE_MAX_AGE_MS = 60 * 60 * 1000;

const UnreadCountContext = createContext({});

const isPendingProfileBootstrap = (error) =>
  error?.code === 'NOT_FOUND' || error?.status === 404;

export function UnreadCountProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const intervalRef = useRef(null);
  const unreadCacheKey = auth.currentUser?.uid
    ? `notifications:unread:${auth.currentUser.uid}`
    : null;

  const loadUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      if (unreadCacheKey) {
        const cached = await readLocalCache(unreadCacheKey, {
          maxAgeMs: UNREAD_CACHE_MAX_AGE_MS,
        });
        if (typeof cached === 'number') setUnreadCount(cached);
      }

      const response = await getUnreadCount();
      const count = Number(response?.data?.count || 0);
      setUnreadCount(count);
      if (unreadCacheKey) writeLocalCache(unreadCacheKey, count);
    } catch (error) {
      appLogger.warn('Erro ao buscar contador de notificações', { error });
    }
  }, [isAuthenticated, unreadCacheKey]);

  const loadBootstrap = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const bootstrap = await getAppBootstrap();
      setUnreadCount(bootstrap.unreadNotifications);

      if (unreadCacheKey) {
        writeLocalCache(unreadCacheKey, bootstrap.unreadNotifications);
      }

      if (auth.currentUser?.uid && bootstrap.user) {
        const cachedSummary = {
          profile: bootstrap.user,
          followedSummary: bootstrap.followedSummary,
          unreadNotifications: bootstrap.unreadNotifications,
        };
        writeLocalCache(`profile:me:${auth.currentUser.uid}`, cachedSummary);
        if (bootstrap.user.username) {
          writeLocalCache(
            `profile:${String(bootstrap.user.username).trim().toLowerCase()}:summary`,
            {
              profile: bootstrap.user,
              followedComplaints: [],
              followedSummary: bootstrap.followedSummary,
            }
          );
        }
      }
    } catch (error) {
      if (isPendingProfileBootstrap(error)) return;

      appLogger.warn('Erro ao carregar bootstrap do app', { error });
    }
  }, [isAuthenticated, unreadCacheKey]);

  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }

    loadBootstrap();
    loadUnreadCount();

    intervalRef.current = setInterval(loadUnreadCount, POLLING_INTERVAL);

    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        loadUnreadCount();
      }
    });

    return () => {
      clearInterval(intervalRef.current);
      subscription.remove();
    };
  }, [isAuthenticated, loadBootstrap, loadUnreadCount]);

  return (
    <UnreadCountContext.Provider value={{ unreadCount, reloadUnreadCount: loadUnreadCount }}>
      {children}
    </UnreadCountContext.Provider>
  );
}

export function useUnreadCount() {
  return useContext(UnreadCountContext);
}
