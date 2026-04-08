import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { formatDate } from '@/utils/date.utils';

export function DetailInfoBar({ complaint, status, type, emoji, isHelping, styles, colorScheme }) {
  return (
    <View style={styles.detailHeroFooter}>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={[styles.detailStatusPill, { backgroundColor: isHelping ? '#1A936F' : '#E24B4A' }]}>
          <Text style={styles.detailStatusPillText}>
            {isHelping ? 'Em curso' : status.label.replace('● ', '')}
          </Text>
        </View>

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
