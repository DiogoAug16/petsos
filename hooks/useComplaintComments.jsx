import {
  createComplaintComment,
  getComplaintComments,
  likeComment,
  unlikeComment,
} from '@/services/comments.service';
import { useCallback, useEffect, useState } from 'react';

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
  const [comments, setComments] = useState([]);
  const [pageInfo, setPageInfo] = useState(DEFAULT_PAGE_INFO);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [totalComments, setTotalComments] = useState(0);
  const [initialReady, setInitialReady] = useState(false);
  const [initialError, setInitialError] = useState(null);

  const loadInitial = useCallback(async () => {
    if (!complaintId) {
      setInitialReady(false);
      setInitialError('Não foi possível identificar a denúncia.');
      return false;
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
  }, [complaintId]);

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
      const trimmedText = text.trim();
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
    [complaintId, submitting],
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

  const toggleLike = useCallback(
    async (comment) => {
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
    [complaintId, updateComment],
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
    initialReady,
    initialError,
    loadInitial,
    loadMore,
    addComment,
    toggleLike,
    incrementRepliesCount,
  };
}
