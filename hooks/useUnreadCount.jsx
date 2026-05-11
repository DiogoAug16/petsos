import { getUnreadCount } from '@/services/notifications.service';
import { useCallback, useEffect, useState } from 'react';

export function useUnreadCount() {
  const [unreadCount, setUnreadCount] = useState(0);

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
  }, [loadUnreadCount]);

  return {
    unreadCount,
    reloadUnreadCount: loadUnreadCount,
  };
}