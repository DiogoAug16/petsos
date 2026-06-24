import { View } from 'react-native';

import { DetailInfoBar } from '@/components/complaints/detail/detail-info-bar';
import { DetailMainCard } from '@/components/complaints/detail/detail-main-card';

export function DetailLeadSection({
  address,
  complaint,
  followersState,
  isOwner,
  status,
  type,
  emoji,
  styles,
}) {
  return (
    <View style={styles.detailLeadStack}>
      <DetailMainCard
        complaint={complaint}
        address={address}
        followers={followersState.followers}
        totalFollowers={followersState.totalFollowers}
        followersLoading={followersState.loading}
        showFollowers={isOwner}
        styles={styles}
      />

      <DetailInfoBar
        complaint={complaint}
        status={status}
        type={type}
        emoji={emoji}
        styles={styles}
      />
    </View>
  );
}
