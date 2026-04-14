import { Text, View } from 'react-native';
import { formatDate } from '@/utils/date.utils';

export function DetailRegistrarCard({ complaint, styles }) {
  return (
    <View style={styles.detailCard}>
      <Text style={styles.detailSectionLabel}>Registado por</Text>
      <View style={styles.detailRegistrarRow}>
        <View style={styles.detailAvatar}>
          <Text style={styles.detailAvatarText}>N/A</Text>
        </View>
        <View>
          <Text style={styles.detailRegistrarName}>{complaint.registrarName || 'Utilizador Anónimo'}</Text>
          <Text style={styles.detailRegistrarDate}>{formatDate(complaint.createdAt)}</Text>
        </View>
      </View>
    </View>
  );
}
