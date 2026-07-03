// hooks/useComplaintsFetch.jsx
import { getAdminComplaints, getComplaints } from '@/services/complaints/complaints.service';
import { filterPubliclyVisibleComplaints } from '@/utils/complaints/visibility.utils';
import { readLocalCache, writeLocalCache } from '@/utils/shared/local-cache';
import { useCallback, useState } from 'react';

const DEFAULT_PAGE_INFO = {
  limit: 50,
  hasMore: false,
  nextCursor: null,
  totalItems: 0,
};
const FIRST_PAGE_CACHE_MAX_AGE_MS = 6 * 60 * 60 * 1000;

export function useComplaintsFetch({ includeAdminComplaints = false } = {}) {
  const [data, setData] = useState([]);
  const [pageInfo, setPageInfo] = useState(DEFAULT_PAGE_INFO);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchComplaints = useCallback(async (signal, options = {}) => {
    const { silent = false, append = false, cursor } = options;
    const cacheKey = includeAdminComplaints
      ? 'complaints:first-page:admin'
      : 'complaints:first-page:public';

    try {
      let cacheApplied = false;
      if (!append && !cursor && !silent) {
        const cached = await readLocalCache(cacheKey, {
          maxAgeMs: FIRST_PAGE_CACHE_MAX_AGE_MS,
        });
        if (cached?.items) {
          setData(
            includeAdminComplaints
              ? cached.items
              : filterPubliclyVisibleComplaints(cached.items)
          );
          setPageInfo(cached.pageInfo ?? DEFAULT_PAGE_INFO);
          setLoading(false);
          cacheApplied = true;
        }
      }

      if (append) {
        setLoadingMore(true);
      } else if (!silent && !cacheApplied) {
        setLoading(true);
      }
      setError(null);
      const result = includeAdminComplaints
        ? await getAdminComplaints({ signal, cursor })
        : await getComplaints({ signal, cursor });
      const items = includeAdminComplaints
        ? result.items
        : filterPubliclyVisibleComplaints(result.items);
      const safeResult = { ...result, items };

      setData((current) => (append ? [...current, ...items] : items));
      setPageInfo(result.pageInfo);
      if (!append && !cursor) {
        writeLocalCache(cacheKey, safeResult);
      }
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
  }, [includeAdminComplaints]);

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
