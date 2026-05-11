import {
  followComplaint as followComplaintRequest,
  getComplaintFollowers,
  getComplaintFollowersCount,
  getIsFollowingComplaint,
  unfollowComplaint,
} from '@/services/complaint-followers.service';
import { useAuth } from '@/context/AuthContext';
import { useRequireAuth } from '@/context/AuthPromptContext';
import { useCallback, useEffect, useState } from 'react';

const normalizeFollowers = (response) =>
  Array.isArray(response?.data) ? response.data : [];

const normalizeFollowersCount = (response) => {
  if (typeof response?.data === 'number') return response.data;

  return Number(response?.data?.totalFollowers ?? response?.data?.count ?? 0);
};

export function useComplaintFollowers(complaintId) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const requireAuth = useRequireAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [totalFollowers, setTotalFollowers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [unfollowModalVisible, setUnfollowModalVisible] = useState(false);
  const [initialReady, setInitialReady] = useState(false);
  const [initialError, setInitialError] = useState(null);

  const loadFollowers = useCallback(async () => {
    if (!complaintId) return;

    const countResponse = await getComplaintFollowersCount(complaintId);

    setTotalFollowers(normalizeFollowersCount(countResponse));

    if (!isAuthenticated) {
      setFollowers([]);
      return;
    }

    const followersResponse = await getComplaintFollowers(complaintId);
    setFollowers(normalizeFollowers(followersResponse));
  }, [complaintId, isAuthenticated]);

  const refresh = useCallback(async () => {
    if (!complaintId) {
      setInitialReady(false);
      setInitialError('Não foi possível identificar a denúncia.');
      return false;
    }

    if (authLoading) {
      setInitialReady(false);
      return false;
    }

    try {
      setLoading(true);
      setInitialReady(false);
      setInitialError(null);

      if (!isAuthenticated) {
        await loadFollowers();
        setIsFollowing(false);
        setInitialReady(true);
        return true;
      }

      const [followingResponse] = await Promise.all([
        getIsFollowingComplaint(complaintId),
        loadFollowers(),
      ]);

      setIsFollowing(Boolean(followingResponse?.data?.isFollowing));
      setInitialReady(true);
      return true;
    } catch {
      setIsFollowing(false);
      setFollowers([]);
      setTotalFollowers(0);
      setInitialReady(false);
      setInitialError('Não foi possível carregar os acompanhantes.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [authLoading, complaintId, isAuthenticated, loadFollowers]);

  const refreshFollowers = useCallback(async () => {
    if (!complaintId) return false;

    try {
      await loadFollowers();
      return true;
    } catch {
      return false;
    }
  }, [complaintId, loadFollowers]);

  const follow = useCallback(async () => {
    if (!complaintId || actionLoading) return false;

    if (!isAuthenticated) {
      requireAuth(null, {
        title: 'Entre para acompanhar',
        message:
          'Faca login ou crie uma conta para acompanhar denuncias e receber atualizacoes.',
      });
      return false;
    }

    const previousIsFollowing = isFollowing;
    const shouldIncrementFollowers = !previousIsFollowing;

    try {
      setActionLoading(true);
      setIsFollowing(true);
      if (shouldIncrementFollowers) {
        setTotalFollowers((current) => current + 1);
      }

      await followComplaintRequest(complaintId);
      await refreshFollowers();

      return true;
    } catch (err) {
      if (err?.message?.includes('409')) {
        setIsFollowing(true);
        const refreshed = await refreshFollowers();
        if (!refreshed && shouldIncrementFollowers) {
          setTotalFollowers((current) => Math.max(current - 1, 0));
        }
        return true;
      }

      setIsFollowing(previousIsFollowing);
      if (shouldIncrementFollowers) {
        setTotalFollowers((current) => Math.max(current - 1, 0));
      }
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [
    actionLoading,
    complaintId,
    isAuthenticated,
    isFollowing,
    refreshFollowers,
    requireAuth,
  ]);

  const unfollow = useCallback(async () => {
    if (!complaintId || actionLoading) return false;

    if (!isAuthenticated) {
      requireAuth(null, {
        title: 'Entre para acompanhar',
        message:
          'Faca login ou crie uma conta para acompanhar denuncias e receber atualizacoes.',
      });
      return false;
    }

    const previousIsFollowing = isFollowing;
    const shouldDecrementFollowers = previousIsFollowing;

    try {
      setActionLoading(true);
      setIsFollowing(false);
      if (shouldDecrementFollowers) {
        setTotalFollowers((current) => Math.max(current - 1, 0));
      }

      await unfollowComplaint(complaintId);
      await refreshFollowers();
      return true;
    } catch {
      setIsFollowing(previousIsFollowing);
      if (shouldDecrementFollowers) {
        setTotalFollowers((current) => current + 1);
      }
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [
    actionLoading,
    complaintId,
    isAuthenticated,
    isFollowing,
    refreshFollowers,
    requireAuth,
  ]);

  const toggleFollow = useCallback(() => {
    requireAuth(
      () => {
        if (isFollowing) {
          setUnfollowModalVisible(true);
          return;
        }

        follow();
      },
      {
        title: 'Entre para acompanhar',
        message:
          'Faça login ou crie uma conta para acompanhar denúncias e receber atualizações.',
      },
    );
  }, [follow, isFollowing, requireAuth]);

  const closeUnfollowModal = useCallback(() => {
    setUnfollowModalVisible(false);
  }, []);

  const confirmUnfollow = useCallback(async () => {
    const unfollowed = await unfollow();
    if (unfollowed) {
      setUnfollowModalVisible(false);
    }
  }, [unfollow]);

  useEffect(() => {
    setInitialReady(false);
    setInitialError(null);
    refresh();
  }, [refresh]);

  return {
    isFollowing,
    followers,
    totalFollowers,
    loading,
    actionLoading,
    unfollowModalVisible,
    initialReady,
    initialError,
    follow,
    unfollow,
    toggleFollow,
    closeUnfollowModal,
    confirmUnfollow,
    refresh,
  };
}
