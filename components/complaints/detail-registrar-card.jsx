import { Text, View } from 'react-native';
import { formatDate } from '@/utils/date.utils';

export function DetailRegistrarCard({ complaint, styles }) {
  const username = complaint.createdByUsername;
  const initials = username ? username.slice(0, 2).toUpperCase() : '?';

  return (
    <View style={styles.detailCard}>
      <Text style={styles.detailSectionLabel}>Registrado por</Text>
      <View style={styles.detailRegistrarRow}>
        <View style={styles.detailAvatar}>
          <Text style={styles.detailAvatarText}>{initials}</Text>
        </View>
        <View>
          <Text style={styles.detailRegistrarName}>{username || 'Usuário desconhecido'}</Text>
          <Text style={styles.detailRegistrarDate}>{formatDate(complaint.createdAt)}</Text>
        </View>
      </View>
    </View>
  );
}
