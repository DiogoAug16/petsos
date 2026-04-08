import { Text, View } from 'react-native';
import ComplaintPhotos from './complaint-photos';

export function DetailPhotosCard({ photos, styles }) {
  if (!photos?.length) return null;

  return (
    <View style={styles.detailCard}>
      <Text style={styles.detailSectionLabel}>Fotos de evidência</Text>
      <ComplaintPhotos photos={photos} />
    </View>
  );
}
