import { EvidenceSubmitModal } from '@/components/complaints/evidence-submit/evidence-submit-modal';
import { FollowConfirmModal } from '@/components/complaints/detail/follow-confirm-modal';
import { UnfollowConfirmModal } from '@/components/complaints/detail/unfollow-confirm-modal';
import { UnvolunteerConfirmModal } from '@/components/complaints/detail/unvolunteer-confirm-modal';
import { VolunteerConfirmModal } from '@/components/complaints/detail/volunteer-confirm-modal';

export function DetailConfirmationModals({
  complaintId,
  evidenceModalVisible,
  followersState,
  onCloseEvidence,
  onEvidenceSubmitted,
  styles,
  volunteersState,
}) {
  return (
    <>
      <FollowConfirmModal
        visible={followersState.followModalVisible}
        loading={followersState.actionLoading}
        onCancel={followersState.closeFollowModal}
        onConfirm={followersState.confirmFollow}
        styles={styles}
      />

      <UnfollowConfirmModal
        visible={followersState.unfollowModalVisible}
        loading={followersState.actionLoading}
        onCancel={followersState.closeUnfollowModal}
        onConfirm={followersState.confirmUnfollow}
        styles={styles}
      />

      <VolunteerConfirmModal
        visible={volunteersState.volunteerModalVisible}
        loading={volunteersState.actionLoading}
        onCancel={volunteersState.closeVolunteerModal}
        onConfirm={volunteersState.confirmVolunteer}
        styles={styles}
      />

      <UnvolunteerConfirmModal
        visible={volunteersState.unvolunteerModalVisible}
        loading={volunteersState.actionLoading}
        onCancel={volunteersState.closeUnvolunteerModal}
        onConfirm={volunteersState.confirmUnvolunteer}
        styles={styles}
      />

      <EvidenceSubmitModal
        visible={evidenceModalVisible}
        complaintId={complaintId}
        onClose={onCloseEvidence}
        onSubmitted={onEvidenceSubmitted}
      />
    </>
  );
}
