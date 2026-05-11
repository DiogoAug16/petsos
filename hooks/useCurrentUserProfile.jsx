import { getCurrentUserProfile } from '@/services/users.service';
import { useCallback, useEffect, useState } from 'react';

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
      setLoading(true);
      setError(null);
      const result = await getCurrentUserProfile();
      setProfile(result);
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
