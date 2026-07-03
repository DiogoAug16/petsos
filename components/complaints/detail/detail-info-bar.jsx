import { formatDate } from '@/utils/shared/date.utils';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

const formatAnimalLabel = (animal) => {
  if (!animal || animal?.toLowerCase?.() === 'outro') return 'Não informado';
  return animal;
};

export function DetailInfoBar({ complaint, status, type, emoji, styles }) {
  const animalLabel = formatAnimalLabel(complaint.animal);

  return (
    <View style={styles.detailHeroFooter}>
      <View style={styles.detailPillRow}>
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

      <View style={styles.detailMetaGrid}>
        <View style={styles.detailMetaItem}>
          <View style={styles.detailMetaIconBox}>
            <Text style={styles.detailMetaIcon}>{emoji}</Text>
          </View>
          <View style={styles.detailMetaCopy}>
            <Text style={styles.detailMetaLabel}>Animal</Text>
            <Text style={styles.detailMetaText} numberOfLines={1}>
              {animalLabel}
            </Text>
          </View>
        </View>
          
        <View style={styles.detailMetaItem}>
          <View style={styles.detailMetaIconBox}>
            <Ionicons 
              name="time-outline" 
              size={16} 
              color="#FF8C42"
            />
          </View>
          <View style={styles.detailMetaCopy}>
            <Text style={styles.detailMetaLabel}>Registro</Text>
            <Text style={styles.detailMetaText} numberOfLines={1}>
              {formatDate(complaint.createdAt)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
