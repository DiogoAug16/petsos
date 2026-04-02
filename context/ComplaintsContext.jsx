// context/ComplaintsContext.jsx
import { getComplaints } from '@/services/complaints.service';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const ComplaintsContext = createContext(null);

export function ComplaintsProvider({ children }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchComplaints = useCallback(async (signal, options = {}) => {
    const { silent = false } = options;

    try {
      if (!silent) {
        setLoading(true);
      }
      setError(null);
      const result = await getComplaints(signal);

      setData(result);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message ?? 'Erro ao carregar denúncias');
    } finally {
      if (!silent) {
        setLoading(false);
      }
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (typeof AbortController !== 'undefined') {
      const controller = new AbortController();
      fetchComplaints(controller.signal);
      return () => controller.abort();
    } else {
      fetchComplaints();
    }
  }, [fetchComplaints]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    if (typeof AbortController !== 'undefined') {
      const controller = new AbortController();
      await fetchComplaints(controller.signal, { silent: true });
    } else {
      await fetchComplaints(undefined, { silent: true });
    }
  }, [fetchComplaints]);

  const refetchSilent = useCallback(async () => {
    if (typeof AbortController !== 'undefined') {
      const controller = new AbortController();
      await fetchComplaints(controller.signal, { silent: true });
    } else {
      await fetchComplaints(undefined, { silent: true });
    }
  }, [fetchComplaints]);

  const refetch = useCallback(async () => {
    if (typeof AbortController !== 'undefined') {
      const controller = new AbortController();
      await fetchComplaints(controller.signal);
    } else {
      await fetchComplaints();
    }
  }, [fetchComplaints]);

  return (
    <ComplaintsContext.Provider
      value={{
        data,
        complaints: data,
        loading,
        refreshing,
        error,
        refetch,
        refetchSilent,
        refresh,
      }}
    >
      {children}
    </ComplaintsContext.Provider>
  );
}

export function useComplaints() {
  const context = useContext(ComplaintsContext);
  if (!context) {
    throw new Error('useComplaints deve ser usado dentro de ComplaintsProvider');
  }
  return context;
}
