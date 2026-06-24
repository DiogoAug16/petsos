// hooks/useComplaintsFetch.jsx
import { getComplaints } from '@/services/complaints.service';
import { useCallback, useState } from 'react';

const DEFAULT_PAGE_INFO = {
  limit: 50,
  hasMore: false,
  nextCursor: null,
  totalItems: 0,
};

export function useComplaintsFetch() {
  const [data, setData] = useState([]);
  const [pageInfo, setPageInfo] = useState(DEFAULT_PAGE_INFO);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchComplaints = useCallback(async (signal, options = {}) => {
    const { silent = false, append = false, cursor } = options;

    try {
      if (append) {
        setLoadingMore(true);
      } else if (!silent) {
        setLoading(true);
      }
      setError(null);
      const result = await getComplaints({ signal, cursor });

      setData((current) => (append ? [...current, ...result.items] : result.items));
      setPageInfo(result.pageInfo);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message ?? 'Erro ao carregar denúncias');
    } finally {
      if (!silent) {
        setLoading(false);
      }
      setLoadingMore(false);
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

  const loadMore = useCallback(async () => {
    if (loadingMore || !pageInfo?.hasMore || !pageInfo?.nextCursor) return;

    await executeWithAbortController((signal) =>
      fetchComplaints(signal, {
        append: true,
        silent: true,
        cursor: pageInfo.nextCursor,
      })
    );
  }, [
    executeWithAbortController,
    fetchComplaints,
    loadingMore,
    pageInfo?.hasMore,
    pageInfo?.nextCursor,
  ]);

  return {
    data,
    pageInfo,
    loading,
    loadingMore,
    refreshing,
    error,
    fetchComplaints,
    refresh,
    refetchSilent,
    refetch,
    loadMore,
  };
}
