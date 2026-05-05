import api from "@/services/api";
import { useCallback, useState } from "react";

export function useFollowComplaint() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkIsFollowing = useCallback(async (complaintId) => {
    if (!complaintId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/complaint-followers/${complaintId}`);

      const followers = response.data?.data ?? response.data ?? [];

      setIsFollowing(followers.length > 0);
    } catch (_err) {
      setError("Erro ao verificar acompanhamento");
    } finally {
      setLoading(false);
    }
  }, []);

  const followComplaint = useCallback(async (complaintId) => {
    if (!complaintId) return;

    try {
      setLoading(true);
      setError(null);

      await api.post(`/complaints/${complaintId}/assumir`);

      setIsFollowing(true);
    } catch (_err) {
      setError("Erro ao assumir denúncia");
    } finally {
      setLoading(false);
    }
  }, []);

  const unfollowComplaint = useCallback(async (complaintId) => {
    if (!complaintId) return;

    try {
      setLoading(true);
      setError(null);

      await api.delete(`/complaint-followers/${complaintId}`);

      setIsFollowing(false);
    } catch (_err) {
      setError("Erro ao parar de acompanhar");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    isFollowing,
    followComplaint,
    unfollowComplaint,
    checkIsFollowing,
    loading,
    error,
  };
}