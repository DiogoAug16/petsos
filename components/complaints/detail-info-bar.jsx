import { formatDate } from '@/utils/date.utils';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

export function DetailInfoBar({ complaint, status, type, emoji, styles, colorScheme }) {
  return (
    <View style={styles.detailHeroFooter}>
<View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        <View style={[styles.detailPill, { borderColor: status.color }]}> 
          <Text style={[styles.detailPillText, { color: status.color }]}> 
            {status.label.replace('● ', '')}
          </Text>
        </View>

        <View style={styles.detailPill}>
          <Text style={styles.detailPillText}>{type.label}</Text>
        </View>

        {((complaint?.status === 'resolved' || complaint?.status === 'resolvido') && complaint?.resolvedBy) && (
          <View style={styles.detailPill}>
            <Text
              style={[
                styles.detailPillText,
                { color: complaint.resolvedBy === 'community' ? '#10B981' : status.color },
              ]}
            >
              {complaint.resolvedBy === 'community'
                ? '🤝 Resolvido pela Comunidade'
                : '✍️ Resolvido pelo Autor'}
            </Text>
          </View>
        )}
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
