import { CommunityVotePanel } from "./community-vote-panel";
import { EvidencePhotoModal } from "./evidence-photo-modal";
import {
  DISPLAY_STATUSES,
  REQUEST_REASON_LABELS,
  VALIDATION_STATUSES,
} from "@/constants/complaints/complaint-evidence-validation.constants";
import { useEvidenceValidation } from "@/hooks/complaints/useEvidenceValidation";
import {
  isClosedByCommunity,
  isRejectedByCommunity,
  isResolvedByCommunity,
} from "@/utils/complaints/evidence-validation.utils";
import { OwnerEvidenceValidation } from "./owner-evidence-validation";
import { ValidationResultCard } from "./validation-result-card";

export function EvidenceValidationSection({
  complaint,
  isOwner,
  isVolunteer,
  isFollowing,
  evidences: evidencesProp,
  onStatusChanged,
}) {
  const state = useEvidenceValidation({
    complaint,
    isOwner,
    isVolunteer,
    isFollowing,
    evidences: evidencesProp,
    onStatusChanged,
  });

  if (!DISPLAY_STATUSES.includes(complaint?.status)) return null;

  const photoModal = (
    <EvidencePhotoModal
      photoUri={state.fullscreenPhoto}
      onClose={() => state.setFullscreenPhoto(null)}
    />
  );

  if (isOwner && VALIDATION_STATUSES.includes(complaint?.status)) {
    return (
      <>
        <OwnerEvidenceValidation
          loading={state.loading}
          selectedIds={state.selectedIds}
          pendingEvidences={state.pendingEvidences}
          resolveUri={state.resolveUri}
          onToggleSelection={state.toggleSelection}
          onSelectAll={state.selectAll}
          onClearSelection={state.clearSelection}
          onValidate={state.handleValidate}
          onPhotoPress={state.setFullscreenPhoto}
        />
        {photoModal}
      </>
    );
  }

  if (state.communityResolved || isResolvedByCommunity(complaint)) {
    return <ValidationResultCard type="resolved" />;
  }

  if (state.communityClosed || isClosedByCommunity(complaint)) {
    return <ValidationResultCard type="closed" />;
  }

  if (state.communityRejected || isRejectedByCommunity(complaint)) {
    return (
      <ValidationResultCard
        type="rejected"
        expiresAt={
          state.voteStatus?.rejectionInfo?.rejectionExpiresAt ||
          complaint?.rejectionExpiresAt
        }
      />
    );
  }

  if (!isFollowing && !isVolunteer) return null;
  if (!complaint?.validationRequestedAt) return null;

  return (
    <>
      <CommunityVotePanel
        complaint={complaint}
        requestReason={
          REQUEST_REASON_LABELS[complaint?.validationRequestReasonType] || null
        }
        voteStatus={state.voteStatus}
        voteLoading={state.voteLoading}
        pendingEvidences={state.pendingEvidences}
        resolveUri={state.resolveUri}
        onLoadVoteStatus={state.loadVoteStatus}
        onVote={state.handleVote}
        onPhotoPress={state.setFullscreenPhoto}
      />
      {photoModal}
    </>
  );
}
