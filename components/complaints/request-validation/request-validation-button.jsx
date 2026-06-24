import { Modal, View } from 'react-native';

import { REQUEST_VALIDATION_ALLOWED_STATUSES } from '@/constants/complaints/complaint-request-validation.constants';
import { useRequestValidation } from '@/hooks/complaints/useRequestValidation';
import { useUploadUrl } from '@/hooks/shared/useUploadUrl';
import { requestValidationStyles as styles } from '@/styles/complaints/request-validation.styles';

import { RequestValidationCard } from './request-validation-card';
import { RequestValidationEvidenceStep } from './request-validation-evidence-step';
import { RequestValidationReasonStep } from './request-validation-reason-step';

export function RequestValidationButton({
  complaint,
  isVolunteer,
  onRequested,
  evidences,
}) {
  const uploadUrl = useUploadUrl();
  const requestValidation = useRequestValidation({
    complaint,
    evidences,
    onRequested,
  });

  if (
    !complaint ||
    !isVolunteer ||
    !REQUEST_VALIDATION_ALLOWED_STATUSES.includes(complaint.status) ||
    requestValidation.alreadyRequested
  ) {
    return null;
  }

  const resolveUri = (uri) => {
    if (!uri) return '';
    if (/^(https?:|file:)/i.test(uri)) return uri;
    if (!uploadUrl) return uri;

    const base = uploadUrl.endsWith('/') ? uploadUrl.slice(0, -1) : uploadUrl;
    const path = uri.startsWith('/') ? uri : `/${uri}`;
    return `${base}${path}`;
  };

  return (
    <>
      <RequestValidationCard
        onOpen={() => requestValidation.setVisible(true)}
        styles={styles}
      />

      <Modal
        transparent
        visible={requestValidation.visible}
        animationType="fade"
        onRequestClose={requestValidation.handleModalClose}
      >
        <View style={styles.backdrop}>
          <View style={styles.card}>
            {requestValidation.step === 'reason' ? (
              <RequestValidationReasonStep
                hasPendingEvidences={requestValidation.hasPendingEvidences}
                loading={requestValidation.loading}
                reasonText={requestValidation.reasonText}
                selectedLabel={requestValidation.selectedLabel}
                selectedReason={requestValidation.selectedReason}
                onCancel={requestValidation.closeModal}
                onChangeReasonText={requestValidation.setReasonText}
                onNext={requestValidation.handleNext}
                onSelectReason={requestValidation.setSelectedReason}
                styles={styles}
              />
            ) : (
              <RequestValidationEvidenceStep
                loading={requestValidation.loading}
                pendingEvidences={requestValidation.pendingEvidences}
                selectedEvidenceIds={requestValidation.selectedEvidenceIds}
                onBack={() => requestValidation.setStep('reason')}
                onSubmit={requestValidation.handleSubmit}
                onToggleEvidence={requestValidation.toggleEvidence}
                resolveUri={resolveUri}
                styles={styles}
              />
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}
