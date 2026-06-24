import { useEffect, useRef } from 'react';
import {
  enqueueMapTileInvalidation,
  subscribeMapTileInvalidations,
} from '@/utils/map/map-tile-invalidation-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const RECONNECT_DELAY_MS = 3000;

const getTileEventsUrl = () => {
  if (!API_URL) return null;

  return `${API_URL.trim().replace(/\/$/, '').replace(/^http/i, 'ws')}/complaints/map/tiles/events`;
};

export const useMapTileInvalidations = (onInvalidate) => {
  const callbackRef = useRef(onInvalidate);

  useEffect(() => {
    callbackRef.current = onInvalidate;
  }, [onInvalidate]);

  useEffect(() => {
    return subscribeMapTileInvalidations((payload) => {
      callbackRef.current?.(payload);
    });
  }, []);

  useEffect(() => {
    const url = getTileEventsUrl();
    if (!url) return undefined;

    let socket = null;
    let reconnectTimer = null;
    let closed = false;

    const connect = () => {
      socket = new WebSocket(url);

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload?.type === 'map_tiles_invalidated') {
            enqueueMapTileInvalidation(payload);
          }
        } catch (_error) {
          // Ignore malformed realtime payloads.
        }
      };

      socket.onclose = () => {
        if (closed) return;
        reconnectTimer = setTimeout(connect, RECONNECT_DELAY_MS);
      };

      socket.onerror = () => {
        socket?.close();
      };
    };

    connect();

    return () => {
      closed = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      socket?.close();
    };
  }, []);
};
