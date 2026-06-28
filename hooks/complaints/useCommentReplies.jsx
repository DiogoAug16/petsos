import { COMMENTS_PAGE_SIZE } from '@/hooks/complaints/useComplaintComments';
import {
  createCommentReply,
  getCommentReplies,
  likeComment,
  unlikeComment,
} from '@/services/complaints/comments.service';
import { useAuth } from '@/context/AuthContext';
import { useRequireAuth } from '@/context/AuthPromptContext';
import { useRequireVerifiedEmail } from '@/hooks/auth/useRequireVerifiedEmail';
import { useCallback, useState } from 'react';

const DEFAULT_PAGE_INFO = {
  hasMore: false,
  nextCursor: null,
  limit: COMMENTS_PAGE_SIZE,
};

const normalizeReply = (reply) => ({
  ...reply,
  likedByMe: Boolean(reply?.likedByMe),
  likes: Number(reply?.likes ?? 0),
});

const normalizePage = (response) => {
  const page = response?.data || {};

  return {
    items: Array.isArray(page.items) ? page.items.map(normalizeReply) : [],
    pageInfo: page.pageInfo || DEFAULT_PAGE_INFO,
  };
};

const getNextLikeState = (reply) => {
  const likedByMe = !reply.likedByMe;
  const likes = likedByMe
    ? Number(reply.likes ?? 0) + 1
    : Math.max(Number(reply.likes ?? 0) - 1, 0);

  return {
    ...reply,
    likedByMe,
    likes,
  };
};

export function useCommentReplies({ complaintId, commentId, onReplyCreated }) {
  const { isAuthenticated } = useAuth();
  const requireAuth = useRequireAuth();
  const requireVerifiedEmail = useRequireVerifiedEmail();
  const [visible, setVisible] = useState(false);
  const [replies, setReplies] = useState([]);
  const [pageInfo, setPageInfo] = useState(DEFAULT_PAGE_INFO);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadReplies = useCallback(async ({ append = false } = {}) => {
    if (!isAuthenticated) {
      requireAuth(null, {
        title: 'Entre para ver respostas',
        message:
          'Faça login ou crie uma conta para ver e responder comentários.',
      });
      return;
    }

    if (!complaintId || !commentId) return;

    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const response = await getCommentReplies(complaintId, commentId, {
        limit: COMMENTS_PAGE_SIZE,
        cursor: append ? pageInfo.nextCursor : undefined,
      });
      const page = normalizePage(response);

      setReplies((current) => append ? [...current, ...page.items] : page.items);
      setPageInfo(page.pageInfo);
    } catch {
      if (!append) {
        setReplies([]);
      }
      setPageInfo((current) => ({
        ...current,
        hasMore: false,
      }));
    } finally {
      if (append) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  }, [commentId, complaintId, isAuthenticated, pageInfo.nextCursor, requireAuth]);

  const toggleVisible = useCallback(async () => {
    if (visible) {
      setVisible(false);
      return;
    }

    setVisible(true);

    if (!replies.length) {
      await loadReplies();
    }
  }, [loadReplies, replies.length, visible]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !pageInfo?.hasMore) return;
    await loadReplies({ append: true });
  }, [loadReplies, loadingMore, pageInfo?.hasMore]);

  const addReply = useCallback(
    async (text) => {
      if (!isAuthenticated) {
        requireAuth(null, {
          title: 'Entre para responder',
          message:
            'Faça login ou crie uma conta para responder comentários.',
        });
        return null;
      }

      if (
        !requireVerifiedEmail(null, {
          title: 'Confirme seu email',
          message: 'Confirme seu email para responder comentários.',
        })
      ) {
        return null;
      }

      const trimmedText = String(text ?? '').trim();
      if (!complaintId || !commentId || !trimmedText || submitting) return null;

      try {
        setSubmitting(true);
        const response = await createCommentReply(
          complaintId,
          commentId,
          trimmedText
        );
        const reply = normalizeReply(response?.data);

        setReplies((current) => [reply, ...current]);
        setVisible(true);
        onReplyCreated?.(commentId, reply);
        return reply;
      } catch {
        return null;
      } finally {
        setSubmitting(false);
      }
    },
    [
      commentId,
      complaintId,
      isAuthenticated,
      onReplyCreated,
      requireAuth,
      requireVerifiedEmail,
      submitting,
    ],
  );

  const updateReply = useCallback((replyId, updater) => {
    setReplies((current) =>
      current.map((reply) =>
        reply.id === replyId ? updater(reply) : reply
      )
    );
  }, []);

  const toggleLike = useCallback(
    async (reply) => {
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

      if (!complaintId || !reply?.id) return;

      const previousReply = reply;
      const nextReply = getNextLikeState(reply);

      updateReply(reply.id, () => nextReply);

      try {
        const response = nextReply.likedByMe
          ? await likeComment(complaintId, reply.id)
          : await unlikeComment(complaintId, reply.id);
        const result = response?.data;

        if (result) {
          updateReply(reply.id, (current) => ({
            ...current,
            likedByMe: Boolean(result.liked),
            likes: Number(result.likes ?? current.likes),
          }));
        }
      } catch {
        updateReply(reply.id, () => previousReply);
      }
    },
    [complaintId, isAuthenticated, requireAuth, requireVerifiedEmail, updateReply],
  );

  return {
    visible,
    replies,
    pageInfo,
    loading,
    loadingMore,
    submitting,
    toggleVisible,
    loadMore,
    addReply,
    toggleLike,
  };
}
