import { getEvidences } from '@/services/complaints/complaint-evidence.service';
import { useCallback, useEffect, useState } from 'react';

const normalizeEvidences = (response) => {
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response)) return response;
  return [];
};

export function useComplaintEvidence(complaintId, complaintStatus) {
  const [evidences, setEvidences] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!complaintId) return;

    try {
      setLoading(true);
      const response = await getEvidences(complaintId);
      setEvidences(normalizeEvidences(response));
    } catch {
      setEvidences([]);
    } finally {
      setLoading(false);
    }
  }, [complaintId]);

  useEffect(() => {
    refresh();
  }, [refresh, complaintStatus]);

  return {
    evidences,
    loading,
    refresh,
  };
}
