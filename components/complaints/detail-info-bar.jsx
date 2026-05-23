import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { formatDate } from '@/utils/date.utils';
import { StatusBadge } from '@/components/complaints/status-badge';

export function DetailInfoBar({ complaint, status, type, emoji, styles, colorScheme }) {
  return (
    <View style={styles.detailHeroFooter}>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <StatusBadge status={complaint.status} styles={styles} />

        <View style={styles.detailTypePill}>
          <Text style={styles.detailTypePillText}>{type.label}</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={styles.detailMetaItem}>
          <Text style={styles.detailMetaIcon}>{emoji}</Text>
          <Text style={styles.detailMetaText}>{complaint.animal || 'Animal'}</Text>
        </View>
          
        <View style={styles.detailMetaItem}>
          <Ionicons 
            name="time-outline" 
            size={14} 
            color={colorScheme === 'dark' ? '#fff' : '#4A4A4A'} 
          />
          <Text style={styles.detailMetaText}>{formatDate(complaint.createdAt)}</Text>
        </View>
      </View>
    </View>
  );
}
