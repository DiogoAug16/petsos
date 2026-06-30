import {
  getModerationActions,
} from '@/constants/admin/moderation.constants';
import {
  approveComplaintModeration,
  getPendingModerationComplaints,
  hideComplaintModeration,
  rejectComplaintModeration,
} from '@/services/complaints/complaints.service';
import { getModerationTargetId } from '@/utils/admin/moderation.utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';

const ACTION_HANDLERS = {
  approve: approveComplaintModeration,
  reject: rejectComplaintModeration,
  hide: hideComplaintModeration,
};

export function useAdminModeration({ canAccess }) {
  const [items, setItems] = useState([]);
  const [pageInfo, setPageInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [decision, setDecision] = useState(null);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const selectedAction = useMemo(
    () => (decision ? getModerationActions(decision.item)[decision.action] : null),
    [decision]
  );

  const loadPending = useCallback(
    async ({ silent = false, append = false, cursor } = {}) => {
      if (!canAccess) {
        setLoading(false);
        return;
      }

      try {
        if (append) setLoadingMore(true);
        else if (silent) setRefreshing(true);
        else setLoading(true);
        setError(null);

        const result = await getPendingModerationComplaints({ cursor });
        setItems((current) => (append ? [...current, ...result.items] : result.items));
        setPageInfo(result.pageInfo);
      } catch (err) {
        if (err?.status === 403) {
          setError('Acesso negado. Sua conta não tem permissão administrativa.');
          return;
        }
        setError(err?.message ?? 'Não foi possível carregar a fila de moderação.');
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [canAccess]
  );

  useEffect(() => {
    if (canAccess) {
      loadPending();
    }
  }, [canAccess, loadPending]);

  const openDecision = useCallback((item, action) => {
    setDecision({ item, action });
    setReason('');
  }, []);

  const closeDecision = useCallback(() => {
    if (submitting) return;
    setDecision(null);
    setReason('');
  }, [submitting]);

  const submitDecision = useCallback(async () => {
    const trimmedReason = reason.trim();
    const moderationId = getModerationTargetId(decision?.item);
    const handler = ACTION_HANDLERS[decision?.action];

    if (!moderationId || !handler) return;
    if (!trimmedReason) {
      Alert.alert('Motivo obrigatório', 'Informe o motivo da decisão.');
      return;
    }

    setSubmitting(true);
    try {
      await handler(moderationId, trimmedReason);
      setItems((current) =>
        current.filter((item) => getModerationTargetId(item) !== moderationId)
      );
      closeDecision();
    } catch (err) {
      Alert.alert('Erro', err?.message ?? 'Não foi possível enviar a decisão.');
    } finally {
      setSubmitting(false);
    }
  }, [closeDecision, decision, reason]);

  const loadMore = useCallback(() => {
    if (loadingMore || !pageInfo?.hasMore || !pageInfo?.nextCursor) return;
    loadPending({ append: true, cursor: pageInfo.nextCursor });
  }, [loadPending, loadingMore, pageInfo?.hasMore, pageInfo?.nextCursor]);

  const refresh = useCallback(() => {
    loadPending({ silent: true });
  }, [loadPending]);

  return {
    items,
    pageInfo,
    loading,
    refreshing,
    loadingMore,
    error,
    decision,
    reason,
    selectedAction,
    submitting,
    setReason,
    loadPending,
    loadMore,
    refresh,
    openDecision,
    closeDecision,
    submitDecision,
  };
}
