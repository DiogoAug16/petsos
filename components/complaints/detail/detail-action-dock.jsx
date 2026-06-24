import { View } from 'react-native';

import { DetailFollowSummary } from '@/components/complaints/detail/detail-follow-summary';
import { VolunteerButton } from '@/components/complaints/detail/volunteer-button';

export function DetailActionDock({
  complaint,
  followersState,
  isOwner,
  volunteersState,
  onSubmitEvidence,
  styles,
}) {
  if (isOwner && complaint?.status !== 'em_andamento') return null;

  return (
    <View style={styles.detailActionDock}>
      {!isOwner && (
        <DetailFollowSummary
          followers={followersState.followers}
          totalFollowers={followersState.totalFollowers}
          followersLoading={followersState.loading}
          followLoading={followersState.actionLoading}
          isFollowing={followersState.isFollowing}
          isOwner={isOwner}
          onToggleFollow={followersState.toggleFollow}
          styles={styles}
        />
      )}

      <VolunteerButton
        complaint={complaint}
        isOwner={isOwner}
        isVolunteer={volunteersState.isVolunteer}
        volunteerLoading={volunteersState.actionLoading}
        onToggleVolunteer={volunteersState.toggleVolunteer}
        onSubmitEvidence={onSubmitEvidence}
        styles={styles}
      />
    </View>
  );
}
