import { useState } from 'react';
import Toast from 'react-native-toast-message';

import { REQUEST_VALIDATION_REASONS } from '@/constants/complaints/complaint-request-validation.constants';
import { requestComplaintValidation } from '@/services/complaints/complaints.service';

export function useRequestValidation({ complaint, evidences, onRequested }) {
  const [visible, setVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState(
    REQUEST_VALIDATION_REASONS[0].type,
  );
  const [reasonText, setReasonText] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('reason');
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState([]);

  const evidenceList = Array.isArray(evidences) ? evidences : [];
  const pendingEvidences = evidenceList.filter(
    (evidence) => !evidence.status || evidence.status === 'pending',
  );
  const hasPendingEvidences = pendingEvidences.length > 0;
  const alreadyRequested = Boolean(complaint?.validationRequestedAt);
  const selectedLabel = REQUEST_VALIDATION_REASONS.find(
    (reason) => reason.type === selectedReason,
  )?.label;

  const closeModal = () => {
    setVisible(false);
    setStep('reason');
  };

  const handleModalClose = () => {
    if (step === 'evidence') {
      setStep('reason');
      return;
    }

    closeModal();
  };

  const toggleEvidence = (evidenceId) => {
    setSelectedEvidenceIds((prev) =>
      prev.includes(evidenceId)
        ? prev.filter((item) => item !== evidenceId)
        : [...prev, evidenceId],
    );
  };

  const handleNext = () => {
    if (selectedReason === 'evidence_selection') {
      setStep('evidence');
      return;
    }

    handleSubmit();
  };

  const handleSubmit = async () => {
    if (loading || alreadyRequested) return;

    if (selectedReason === 'evidence_selection' && selectedEvidenceIds.length === 0) {
      Toast.show({
        type: 'info',
        text1: 'Selecione evidências',
        text2: 'Escolha ao menos uma evidência para propor à comunidade.',
      });
      return;
    }

    setLoading(true);
    try {
      await requestComplaintValidation(complaint.id, {
        reasonType: selectedReason,
        reasonText: reasonText.trim() || null,
        evidenceIds:
          selectedReason === 'evidence_selection' ? selectedEvidenceIds : undefined,
      });

      Toast.show({
        type: 'success',
        text1: 'Votação solicitada à comunidade',
      });

      closeModal();
      setReasonText('');
      setSelectedEvidenceIds([]);
      onRequested?.();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao solicitar votação',
        text2: error?.message || 'Não foi possível abrir a votação.',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    alreadyRequested,
    hasPendingEvidences,
    loading,
    pendingEvidences,
    reasonText,
    selectedEvidenceIds,
    selectedLabel,
    selectedReason,
    step,
    visible,
    closeModal,
    handleModalClose,
    handleNext,
    handleSubmit,
    setReasonText,
    setSelectedReason,
    setStep,
    setVisible,
    toggleEvidence,
  };
}
