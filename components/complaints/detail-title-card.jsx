import { Text, View } from 'react-native';

export function DetailTitleCard({ complaint, address, styles }) {
  return (
    <View style={styles.detailCard}>
      <Text style={styles.detailTitle}>{complaint.title}</Text>
      <View style={styles.detailMetaContainer}>
        <View style={styles.detailMetaItem}>
          <Text style={styles.detailMetaIcon}>📍</Text>
          <Text style={styles.detailMetaText} numberOfLines={1}>{address || 'Localização'}</Text>
        </View>
      </View>
    </View>
  );
}
