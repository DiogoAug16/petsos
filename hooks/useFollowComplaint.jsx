import { assumeComplaint, getFollowers, unfollowComplaint } from '@/services/complaints.service';
import { useCallback, useState } from 'react';

export function useFollowComplaint() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //  Verifica se o usuário já segue
  const checkIsFollowing = useCallback(async (complaintId) => {
    if (!complaintId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await getFollowers(complaintId);

      const followers = response?.data ?? [];

      setIsFollowing(Array.isArray(followers) && followers.length > 0);
    } catch (_err) {
      setError('Erro ao verificar acompanhamento');
    } finally {
      setLoading(false);
    }
  }, []);

  //  Assumir denúncia
  const followComplaint = useCallback(async (complaintId) => {
    if (!complaintId || loading) return;

    try {
      setLoading(true);
      setError(null);

      await assumeComplaint(complaintId);

      setIsFollowing(true);
    } catch (err) {
      // trata 409 (já está seguindo)
      if (err.message?.includes('409')) {
        setIsFollowing(true);
        return;
      }

      setError('Erro ao assumir denúncia');
    } finally {
      setLoading(false);
    }
  }, [loading]);

  //  Parar de acompanhar
  const unfollow = useCallback(async (complaintId) => {
    if (!complaintId || loading) return;

    try {
      setLoading(true);
      setError(null);

      await unfollowComplaint(complaintId);

      setIsFollowing(false);
    } catch (_err) {
      setError('Erro ao parar de acompanhar');
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return {
    isFollowing,
    followComplaint,
    unfollowComplaint: unfollow,
    checkIsFollowing,
    loading,
    error,
  };
}