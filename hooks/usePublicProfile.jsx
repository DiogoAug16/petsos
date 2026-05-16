import {
  getPublicUserProfile,
  getUserFollowedComplaints,
} from '@/services/users.service';
import { useCallback, useEffect, useState } from 'react';

export function usePublicProfile(username) {
  const [profile, setProfile] = useState(null);
  const [followedComplaints, setFollowedComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadProfile = useCallback(
    async ({ silent = false } = {}) => {
      if (!username) {
        setProfile(null);
        setFollowedComplaints([]);
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

        const [profileResult, complaintsResult] = await Promise.all([
          getPublicUserProfile(username),
          getUserFollowedComplaints(username),
        ]);

        setProfile(profileResult);
        setFollowedComplaints(complaintsResult);
      } catch (err) {
        setError(err?.message ?? 'Não foi possível carregar o perfil.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [username],
  );

  const refresh = useCallback(() => {
    return loadProfile({ silent: true });
  }, [loadProfile]);

  const softReload = useCallback(async () => {
    if (!username) return;
    try {
      const [profileResult, complaintsResult] = await Promise.all([
        getPublicUserProfile(username),
        getUserFollowedComplaints(username),
      ]);
      setProfile(profileResult);
      setFollowedComplaints(complaintsResult);
    } catch {}
  }, [username]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    followedComplaints,
    loading,
    refreshing,
    error,
    refresh,
    softReload,
    reload: loadProfile,
  };
}
