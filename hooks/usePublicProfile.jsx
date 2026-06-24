import {
  getPublicUserProfile,
  getUserFollowedComplaints,
  getUserFollowedComplaintsSummary,
} from '@/services/users.service';
import { useCallback, useEffect, useState } from 'react';

const EMPTY_SUMMARY = { total: 0, resolved: 0 };

const normalizeSummary = (summary) => ({
  total: Number(summary?.total ?? 0),
  resolved: Number(summary?.resolved ?? 0),
});

export function usePublicProfile(username, { includeFollowedComplaints = true } = {}) {
  const [profile, setProfile] = useState(null);
  const [followedComplaints, setFollowedComplaints] = useState([]);
  const [followedSummary, setFollowedSummary] = useState(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfilePayload = useCallback(async () => {
    const [profileResult, summaryResult, followedResult] = await Promise.all([
      getPublicUserProfile(username),
      getUserFollowedComplaintsSummary(username),
      includeFollowedComplaints
        ? getUserFollowedComplaints(username)
        : Promise.resolve([]),
    ]);

    return {
      profile: profileResult,
      followedComplaints: followedResult,
      followedSummary: normalizeSummary(summaryResult),
    };
  }, [includeFollowedComplaints, username]);

  const applyProfilePayload = useCallback((payload) => {
    setProfile(payload.profile);
    setFollowedComplaints(payload.followedComplaints);
    setFollowedSummary(payload.followedSummary);
  }, []);

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

        applyProfilePayload(await fetchProfilePayload());
      } catch (err) {
        setError(err?.message ?? 'Não foi possível carregar o perfil.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [applyProfilePayload, fetchProfilePayload, username],
  );

  const refresh = useCallback(() => {
    return loadProfile({ silent: true });
  }, [loadProfile]);

  const softReload = useCallback(async () => {
    if (!username) return;
    try {
      applyProfilePayload(await fetchProfilePayload());
    } catch (error) {
      console.warn('Erro ao recarregar perfil público', error?.message);
    }
  }, [applyProfilePayload, fetchProfilePayload, username]);

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
