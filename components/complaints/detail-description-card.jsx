import { Text, View } from 'react-native';

export function DetailDescriptionCard({ description, styles }) {
  if (!description) return null;

  return (
    <View style={styles.detailCard}>
      <Text style={styles.detailSectionLabel}>Descrição</Text>
      <Text style={styles.detailDescription}>{description}</Text>
    </View>
  );
}
