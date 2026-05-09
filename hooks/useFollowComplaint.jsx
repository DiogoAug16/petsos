import { assumeComplaint, getIsFollowingComplaint, unfollowComplaint } from '@/services/complaints.service';
import { useCallback, useState } from 'react';



export function useFollowComplaint() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkIsFollowing = useCallback(async (complaintId) => {
    if (!complaintId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await getIsFollowingComplaint(complaintId);

      setIsFollowing(Boolean(response?.data?.isFollowing));
    } catch (_err) {
      setError('Erro ao verificar acompanhamento');
    } finally {
      setLoading(false);
    }
  }, []);

  const followComplaint = useCallback(
    async (complaintId) => {
      if (!complaintId || loading) return;

      try {
        setLoading(true);
        setError(null);

        await assumeComplaint(complaintId);
        await checkIsFollowing(complaintId);
      } catch (err) {
        if (err.message?.includes('409')) {
          await checkIsFollowing(complaintId);
          return;
        }

        setError('Erro ao assumir denúncia');
      } finally {
        setLoading(false);
      }
    },
    [loading, checkIsFollowing],
  );

  const unfollow = useCallback(
    async (complaintId) => {
      if (!complaintId || loading) return;

      try {
        setLoading(true);
        setError(null);

        await unfollowComplaint(complaintId);
        await checkIsFollowing(complaintId);
      } catch (_err) {
        setError('Erro ao parar de acompanhar');
      } finally {
        setLoading(false);
      }
    },
    [loading, checkIsFollowing],
  );

  return {
    isFollowing,
    followComplaint,
    unfollowComplaint: unfollow,
    checkIsFollowing,
    loading,
    error,
  };
}