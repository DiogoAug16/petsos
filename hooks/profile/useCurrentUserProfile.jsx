import { auth } from '@/config/firebase';
import { getCurrentUserProfileSummary } from '@/services/users/users.service';
import { readLocalCache, writeLocalCache } from '@/utils/shared/local-cache';
import { useCallback, useEffect, useState } from 'react';

const PROFILE_CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000;

export function useCurrentUserProfile({ enabled = true } = {}) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProfile = useCallback(async () => {
    if (!enabled) {
      setProfile(null);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      const cacheKey = auth.currentUser?.uid
        ? `profile:me:${auth.currentUser.uid}`
        : null;
      let cacheApplied = false;
      if (cacheKey) {
        const cached = await readLocalCache(cacheKey, {
          maxAgeMs: PROFILE_CACHE_MAX_AGE_MS,
        });
        if (cached?.profile) {
          setProfile(cached.profile);
          setLoading(false);
          cacheApplied = true;
        }
      }

      if (!cacheApplied) setLoading(true);
      setError(null);
      const result = await getCurrentUserProfileSummary();
      setProfile(result.profile);
      if (cacheKey) writeLocalCache(cacheKey, result);
      if (result.profile?.username) {
        writeLocalCache(
          `profile:${String(result.profile.username).trim().toLowerCase()}:summary`,
          {
            profile: result.profile,
            followedComplaints: [],
            followedSummary: result.followedSummary,
          }
        );
      }
    } catch (err) {
      setError(err?.message ?? 'Não foi possível carregar o perfil.');
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    loading,
    error,
    reload: loadProfile,
  };
}
