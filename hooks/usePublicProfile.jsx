import {
  getPublicUserProfile,
  getUserFollowedComplaints,
  getUserFollowedComplaintsSummary,
} from '@/services/users.service';
import { useCallback, useEffect, useState } from 'react';

const EMPTY_SUMMARY = { total: 0, resolved: 0 };

export function usePublicProfile(username, { includeFollowedComplaints = true } = {}) {
  const [profile, setProfile] = useState(null);
  const [followedComplaints, setFollowedComplaints] = useState([]);
  const [followedSummary, setFollowedSummary] = useState(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadProfile = useCallback(
    async ({ silent = false } = {}) => {
      if (!username) {
        setProfile(null);
        setFollowedComplaints([]);
        setFollowedSummary(EMPTY_SUMMARY);
        setError('Perfil não encontrado.');
        setLoading(false);
        return;
      }

      try {
        if (silent) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        setError(null);

        const [profileResult, followedResult] = await Promise.all([
          getPublicUserProfile(username),
          includeFollowedComplaints
            ? getUserFollowedComplaints(username)
            : getUserFollowedComplaintsSummary(username),
        ]);

        setProfile(profileResult);
        if (includeFollowedComplaints) {
          setFollowedComplaints(followedResult);
          setFollowedSummary({
            total: followedResult.length,
            resolved: followedResult.filter((complaint) =>
              ['resolvido', 'resolved'].includes(complaint?.status)
            ).length,
          });
        } else {
          setFollowedComplaints([]);
          setFollowedSummary(followedResult);
        }
      } catch (err) {
        setError(err?.message ?? 'Não foi possível carregar o perfil.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [includeFollowedComplaints, username],
  );

  const refresh = useCallback(() => {
    return loadProfile({ silent: true });
  }, [loadProfile]);

  const softReload = useCallback(async () => {
    if (!username) return;
    try {
      const [profileResult, followedResult] = await Promise.all([
        getPublicUserProfile(username),
        includeFollowedComplaints
          ? getUserFollowedComplaints(username)
          : getUserFollowedComplaintsSummary(username),
      ]);
      setProfile(profileResult);
      if (includeFollowedComplaints) {
        setFollowedComplaints(followedResult);
        setFollowedSummary({
          total: followedResult.length,
          resolved: followedResult.filter((complaint) =>
            ['resolvido', 'resolved'].includes(complaint?.status)
          ).length,
        });
      } else {
        setFollowedComplaints([]);
        setFollowedSummary(followedResult);
      }
    } catch {}
  }, [includeFollowedComplaints, username]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    followedComplaints,
    followedSummary,
    loading,
    refreshing,
    error,
    refresh,
    softReload,
    reload: loadProfile,
  };
}
