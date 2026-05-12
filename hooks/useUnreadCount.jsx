import { getUnreadCount } from '@/services/notifications.service';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

const POLLING_INTERVAL = 30000;

export function useUnreadCount() {
  const [unreadCount, setUnreadCount] = useState(0);
  const intervalRef = useRef(null);

  const loadUnreadCount = useCallback(async () => {
    try {
      const response = await getUnreadCount();

      setUnreadCount(response?.data?.count || 0);
    } catch (error) {
      console.log('Erro ao buscar contador de notificações:', error);
    }
  }, []);

  useEffect(() => {
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
  }, [loadUnreadCount]);

  return {
    unreadCount,
    reloadUnreadCount: loadUnreadCount,
  };
}