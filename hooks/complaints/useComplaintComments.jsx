import {
  createComplaintComment,
  deleteComment,
  getComplaintComments,
  likeComment,
  reportComment,
  unlikeComment,
} from '@/services/complaints/comments.service';
import { COMMENT_REPORT_REASONS } from '@/constants/complaints/report-reasons.constants';
import { useAuth } from '@/context/AuthContext';
import { useRequireAuth } from '@/context/AuthPromptContext';
import { useRequireVerifiedEmail } from '@/hooks/auth/useRequireVerifiedEmail';
import { openReportReasonAlert } from '@/utils/complaints/report-reason-alert.utils';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

export const COMMENTS_PAGE_SIZE = 10;

const DEFAULT_PAGE_INFO = {
  hasMore: false,
  nextCursor: null,
  limit: COMMENTS_PAGE_SIZE,
  totalItems: 0,
};

const normalizeComment = (comment) => ({
  ...comment,
  likedByMe: Boolean(comment?.likedByMe),
  likes: Number(comment?.likes ?? 0),
  repliesCount: Number(comment?.repliesCount ?? 0),
});

const normalizePage = (response) => {
  const page = response?.data || {};
  const items = Array.isArray(page.items) ? page.items.map(normalizeComment) : [];
  const pageInfo = page.pageInfo || DEFAULT_PAGE_INFO;
  const totalItems =
    pageInfo.totalItems === undefined ? items.length : Number(pageInfo.totalItems);

  return {
    items,
    pageInfo: {
      ...DEFAULT_PAGE_INFO,
      ...pageInfo,
      totalItems,
    },
  };
};

const getNextLikeState = (comment) => {
  const likedByMe = !comment.likedByMe;
  const likes = likedByMe
    ? Number(comment.likes ?? 0) + 1
    : Math.max(Number(comment.likes ?? 0) - 1, 0);

  return {
    ...comment,
    likedByMe,
    likes,
  };
};

export function useComplaintComments(complaintId) {
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const requireAuth = useRequireAuth();
  const requireVerifiedEmail = useRequireVerifiedEmail();
  const [comments, setComments] = useState([]);
  const [pageInfo, setPageInfo] = useState(DEFAULT_PAGE_INFO);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [totalComments, setTotalComments] = useState(0);
  const [initialReady, setInitialReady] = useState(false);
  const [initialError, setInitialError] = useState(null);

  const loadInitial = useCallback(async () => {
    if (authLoading) {
      setInitialReady(false);
      setInitialError(null);
      return false;
    }

    if (!complaintId) {
      setInitialReady(false);
      setInitialError('Não foi possível identificar a denúncia.');
      return false;
    }

    if (!isAuthenticated) {
      setComments([]);
      setPageInfo(DEFAULT_PAGE_INFO);
      setTotalComments(0);
      setInitialError(null);
      setInitialReady(true);
      setLoading(false);
      return true;
    }

    try {
      setLoading(true);
      setInitialReady(false);
      setInitialError(null);
      const response = await getComplaintComments(complaintId, {
        limit: COMMENTS_PAGE_SIZE,
      });
      const page = normalizePage(response);

      setComments(page.items);
      setPageInfo(page.pageInfo);
      setTotalComments(page.pageInfo.totalItems);
      setInitialReady(true);
      return true;
    } catch {
      setComments([]);
      setPageInfo(DEFAULT_PAGE_INFO);
      setTotalComments(0);
      setInitialReady(false);
      setInitialError('Não foi possível carregar os comentários.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [authLoading, complaintId, isAuthenticated]);

  const loadMore = useCallback(async () => {
    if (!complaintId || loadingMore || !pageInfo?.hasMore) return;

    try {
      setLoadingMore(true);
      const response = await getComplaintComments(complaintId, {
        limit: COMMENTS_PAGE_SIZE,
        cursor: pageInfo.nextCursor,
      });
      const page = normalizePage(response);

      setComments((current) => [...current, ...page.items]);
      setPageInfo(page.pageInfo);
      setTotalComments(page.pageInfo.totalItems);
    } catch {
      setPageInfo((current) => ({
        ...current,
        hasMore: false,
      }));
    } finally {
      setLoadingMore(false);
    }
  }, [complaintId, loadingMore, pageInfo]);

  const addComment = useCallback(
    async (text) => {
      if (!isAuthenticated) {
        requireAuth(null, {
          title: 'Entre para comentar',
          message:
            'Faça login ou crie uma conta para comentar nesta denúncia.',
        });
        return null;
      }

      if (
        !requireVerifiedEmail(null, {
          title: 'Confirme seu email',
          message: 'Confirme seu email para comentar em denúncias.',
        })
      ) {
        return null;
      }

      const trimmedText = String(text ?? '').trim();
      if (!complaintId || !trimmedText || submitting) return null;

      try {
        setSubmitting(true);
        const response = await createComplaintComment(complaintId, trimmedText);
        const comment = normalizeComment(response?.data);

        setComments((current) => [comment, ...current]);
        setTotalComments((current) => current + 1);
        return comment;
      } catch {
        return null;
      } finally {
        setSubmitting(false);
      }
    },
    [complaintId, isAuthenticated, requireAuth, requireVerifiedEmail, submitting],
  );

  const updateComment = useCallback((commentId, updater) => {
    setComments((current) =>
      current.map((comment) =>
        comment.id === commentId ? updater(comment) : comment
      )
    );
  }, []);

  const incrementRepliesCount = useCallback((commentId) => {
    updateComment(commentId, (comment) => ({
      ...comment,
      repliesCount: Number(comment.repliesCount ?? 0) + 1,
    }));
  }, [updateComment]);

  const decrementRepliesCount = useCallback((commentId) => {
    updateComment(commentId, (comment) => ({
      ...comment,
      repliesCount: Math.max(Number(comment.repliesCount ?? 0) - 1, 0),
    }));
  }, [updateComment]);

  const toggleLike = useCallback(
    async (comment) => {
      if (!isAuthenticated) {
        requireAuth(null, {
          title: 'Entre para curtir',
          message:
            'Faça login ou crie uma conta para curtir comentários.',
        });
        return;
      }

      if (
        !requireVerifiedEmail(null, {
          title: 'Confirme seu email',
          message: 'Confirme seu email para curtir comentários.',
        })
      ) {
        return;
      }

      if (!complaintId || !comment?.id) return;

      const previousComment = comment;
      const nextComment = getNextLikeState(comment);

      updateComment(comment.id, () => nextComment);

      try {
        const response = nextComment.likedByMe
          ? await likeComment(complaintId, comment.id)
          : await unlikeComment(complaintId, comment.id);
        const result = response?.data;

        if (result) {
          updateComment(comment.id, (current) => ({
            ...current,
            likedByMe: Boolean(result.liked),
            likes: Number(result.likes ?? current.likes),
          }));
        }
      } catch {
        updateComment(comment.id, () => previousComment);
      }
    },
    [complaintId, isAuthenticated, requireAuth, requireVerifiedEmail, updateComment],
  );

  const reportCommentItem = useCallback(
    async (comment) => {
      if (!isAuthenticated) {
        requireAuth(null, {
          title: 'Entre para reportar',
          message: 'Faça login ou crie uma conta para reportar comentários.',
        });
        return;
      }

      if (
        !requireVerifiedEmail(null, {
          title: 'Confirme seu email',
          message: 'Confirme seu email para reportar comentários.',
        })
      ) {
        return;
      }

      if (!complaintId || !comment?.id) return;

      openReportReasonAlert({
        title: 'Motivo do reporte',
        message: 'Escolha por que este comentário deve ser analisado.',
        reasons: COMMENT_REPORT_REASONS,
        onSelect: async (reason) => {
          try {
            await reportComment(complaintId, comment.id, reason);
            Alert.alert(
              'Comentário reportado',
              'A moderação recebeu sua denúncia.',
            );
          } catch (error) {
            Alert.alert(
              'Não foi possível reportar',
              error?.message ?? 'Tente novamente em instantes.',
            );
          }
        },
      });
    },
    [complaintId, isAuthenticated, requireAuth, requireVerifiedEmail],
  );

  const deleteCommentItem = useCallback(
    async (comment) => {
      if (!isAdmin || !complaintId || !comment?.id) return;

      Alert.alert(
        'Excluir comentário',
        'Este comentário será removido da seção de comentários.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Excluir',
            style: 'destructive',
            onPress: async () => {
              try {
                await deleteComment(complaintId, comment.id);
                setComments((current) =>
                  current.filter((item) => item.id !== comment.id)
                );
                setTotalComments((current) => Math.max(current - 1, 0));
              } catch (error) {
                Alert.alert(
                  'Não foi possível excluir',
                  error?.message ?? 'Tente novamente em instantes.',
                );
              }
            },
          },
        ],
      );
    },
    [complaintId, isAdmin],
  );

  useEffect(() => {
    setComments([]);
    setPageInfo(DEFAULT_PAGE_INFO);
    setTotalComments(0);
    setInitialReady(false);
    setInitialError(null);
    loadInitial();
  }, [loadInitial]);

  return {
    comments,
    totalComments,
    pageInfo,
    loading,
    loadingMore,
    submitting,
    isBlocked: !isAuthenticated,
    initialReady,
    initialError,
    loadInitial,
    loadMore,
    addComment,
    toggleLike,
    reportCommentItem,
    deleteCommentItem: isAdmin ? deleteCommentItem : null,
    incrementRepliesCount,
    decrementRepliesCount,
  };
}
