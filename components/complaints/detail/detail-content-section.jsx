import { View } from 'react-native';

import { DetailMapCard } from '@/components/complaints/detail/detail-map-card';
import { DetailPhotosCard } from '@/components/complaints/detail/detail-photos-card';
import { EvidenceSection } from '@/components/complaints/detail/evidence-section';

export function DetailContentSection({
  address,
  complaint,
  evidences,
  onOpenMap,
  styles,
}) {
  return (
    <View style={styles.detailContent}>
      <DetailPhotosCard photos={complaint.photos} styles={styles} />

      <DetailMapCard
        complaint={complaint}
        location={complaint.location}
        address={address}
        onOpenMap={onOpenMap}
        styles={styles}
      />

      <EvidenceSection evidences={evidences} styles={styles} />
    </View>
  );
}
