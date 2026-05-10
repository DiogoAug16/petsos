import {
  followComplaint as followComplaintRequest,
  getComplaintFollowers,
  getComplaintFollowersCount,
  getIsFollowingComplaint,
  unfollowComplaint,
} from '@/services/complaint-followers.service';
import { useCallback, useEffect, useState } from 'react';

const normalizeFollowers = (response) =>
  Array.isArray(response?.data) ? response.data : [];

const normalizeFollowersCount = (response) => {
  if (typeof response?.data === 'number') return response.data;

  return Number(response?.data?.totalFollowers ?? response?.data?.count ?? 0);
};

export function useComplaintFollowers(complaintId) {
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

    const [countResponse, followersResponse] = await Promise.all([
      getComplaintFollowersCount(complaintId),
      getComplaintFollowers(complaintId),
    ]);

    setTotalFollowers(normalizeFollowersCount(countResponse));
    setFollowers(normalizeFollowers(followersResponse));
  }, [complaintId]);

  const refresh = useCallback(async () => {
    if (!complaintId) {
      setInitialReady(false);
      setInitialError('Não foi possível identificar a denúncia.');
      return false;
    }

    try {
      setLoading(true);
      setInitialReady(false);
      setInitialError(null);

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
  }, [complaintId, loadFollowers]);

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
  }, [actionLoading, complaintId, isFollowing, refreshFollowers]);

  const unfollow = useCallback(async () => {
    if (!complaintId || actionLoading) return false;

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
  }, [actionLoading, complaintId, isFollowing, refreshFollowers]);

  const toggleFollow = useCallback(() => {
    if (isFollowing) {
      setUnfollowModalVisible(true);
      return;
    }

    follow();
  }, [follow, isFollowing]);

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
