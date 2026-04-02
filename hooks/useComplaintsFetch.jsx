// hooks/useComplaintsFetch.jsx
import { getComplaints } from '@/services/complaints.service';
import { useCallback, useState } from 'react';

export function useComplaintsFetch() {
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

  const executeWithAbortController = useCallback(
    async (callback) => {
      if (typeof AbortController !== 'undefined') {
        const controller = new AbortController();
        await callback(controller.signal);
      } else {
        await callback();
      }
    },
    []
  );

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await executeWithAbortController((signal) =>
      fetchComplaints(signal, { silent: true })
    );
  }, [executeWithAbortController, fetchComplaints]);

  const refetchSilent = useCallback(async () => {
    await executeWithAbortController((signal) =>
      fetchComplaints(signal, { silent: true })
    );
  }, [executeWithAbortController, fetchComplaints]);

  const refetch = useCallback(async () => {
    await executeWithAbortController((signal) => fetchComplaints(signal));
  }, [executeWithAbortController, fetchComplaints]);

  return {
    data,
    loading,
    refreshing,
    error,
    fetchComplaints,
    refresh,
    refetchSilent,
    refetch,
  };
}
