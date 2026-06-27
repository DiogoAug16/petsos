import { useAuth } from '@/context/AuthContext';
import { getUnreadCount } from '@/services/notifications/notifications.service';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

const POLLING_INTERVAL = 30000;

const UnreadCountContext = createContext({});

export function UnreadCountProvider({ children }) {
  const { isAuthenticated, isEmailVerified } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const intervalRef = useRef(null);

  const loadUnreadCount = useCallback(async () => {
    if (!isAuthenticated || !isEmailVerified) return;

    try {
      const response = await getUnreadCount();
      setUnreadCount(response?.data?.count || 0);
    } catch (error) {
      console.log('Erro ao buscar contador de notificações:', error);
    }
  }, [isAuthenticated, isEmailVerified]);

  useEffect(() => {
    if (!isAuthenticated || !isEmailVerified) {
      setUnreadCount(0);
      return;
    }

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
  }, [loadUnreadCount, isAuthenticated, isEmailVerified]);

  return (
    <UnreadCountContext.Provider value={{ unreadCount, reloadUnreadCount: loadUnreadCount }}>
      {children}
    </UnreadCountContext.Provider>
  );
}

export function useUnreadCount() {
  return useContext(UnreadCountContext);
}
