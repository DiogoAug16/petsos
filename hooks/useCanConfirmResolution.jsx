import { useEffect, useState } from 'react';

import { getComplaintValidationsCount } from '@/services/complaints.service';

const MINIMUM_VALIDATIONS = 3;
const VALID_STATUSES = ['awaiting_validation', 'aguardando_validacao'];

export function useCanConfirmResolution({ complaintId, complaint, isOwner }) {
  const [validationsCount, setValidationsCount] = useState(0);

  useEffect(() => {
    async function loadValidationsCount() {
      try {
        const response = await getComplaintValidationsCount(complaintId);
        setValidationsCount(response?.data?.count ?? 0);
      } catch (error) {
        console.log('Erro ao buscar validações', error);
      }
    }

    if (complaintId) {
      loadValidationsCount();
    }
  }, [complaintId]);

  const canConfirmResolution =
    isOwner &&
    VALID_STATUSES.includes(complaint?.status) &&
    validationsCount >= MINIMUM_VALIDATIONS;

  return {
    canConfirmResolution,
    validationsCount,
    minimumValidations: MINIMUM_VALIDATIONS,
  };
}