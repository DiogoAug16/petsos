import {
  getUserFollowedComplaints,
  getPublicUserProfileSummary,
} from '@/services/users/users.service';
import { readLocalCache, writeLocalCache } from '@/utils/shared/local-cache';
import { appLogger } from '@/utils/shared/app-logger';
import { useCallback, useEffect, useState } from 'react';

const EMPTY_SUMMARY = { total: 0, resolved: 0 };
const PROFILE_CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000;

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

  const cacheKey = username
    ? `profile:${String(username).trim().toLowerCase()}:${
        includeFollowedComplaints ? 'full' : 'summary'
      }`
    : null;

  const fetchProfilePayload = useCallback(async () => {
    const [summaryResult, followedResult] = await Promise.all([
      getPublicUserProfileSummary(username),
      includeFollowedComplaints
        ? getUserFollowedComplaints(username)
        : Promise.resolve([]),
    ]);

    return {
      profile: summaryResult.profile,
      followedComplaints: followedResult,
      followedSummary: normalizeSummary(summaryResult.followedSummary),
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
        let cacheApplied = false;
        if (!silent && cacheKey) {
          const cached = await readLocalCache(cacheKey, {
            maxAgeMs: PROFILE_CACHE_MAX_AGE_MS,
          });
          if (cached) {
            applyProfilePayload(cached);
            setLoading(false);
            cacheApplied = true;
          }
        }

        if (silent) {
          setRefreshing(true);
        } else if (!cacheApplied) {
          setLoading(true);
        }
        setError(null);

        const payload = await fetchProfilePayload();
        applyProfilePayload(payload);
        if (cacheKey) writeLocalCache(cacheKey, payload);
      } catch (err) {
        setError(err?.message ?? 'Não foi possível carregar o perfil.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [applyProfilePayload, cacheKey, fetchProfilePayload, username],
  );

  const refresh = useCallback(() => {
    return loadProfile({ silent: true });
  }, [loadProfile]);

  const softReload = useCallback(async () => {
    if (!username) return;
    try {
      const payload = await fetchProfilePayload();
      applyProfilePayload(payload);
      if (cacheKey) writeLocalCache(cacheKey, payload);
    } catch (error) {
      appLogger.warn('Erro ao recarregar perfil público', { error });
    }
  }, [applyProfilePayload, cacheKey, fetchProfilePayload, username]);

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
