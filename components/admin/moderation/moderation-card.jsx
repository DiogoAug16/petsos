import { MODERATION_ACTIONS } from '@/constants/admin/moderation.constants';
import { useAddress } from '@/hooks/complaints/useAddress';
import { useUploadUrl } from '@/hooks/shared/useUploadUrl';
import { buildUploadPhotoUri, getComplaintCoverPhoto } from '@/utils/media/photo.utils';
import {
  getLocationFallbackLabel,
  getModerationComplaint,
} from '@/utils/admin/moderation.utils';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

export function ModerationCard({ item, onAction, styles }) {
  const complaint = getModerationComplaint(item);
  const uploadUrl = useUploadUrl();
  const { address } = useAddress(complaint?.location);
  const photoUri = buildUploadPhotoUri(getComplaintCoverPhoto(complaint), uploadUrl);
  const locationLabel = address || getLocationFallbackLabel(complaint?.location);
  const reportCount = Number(item?.reportCount ?? 0);

  return (
    <View style={styles.card}>
      <View style={styles.photoFrame}>
        {photoUri ? (
          <Image
            source={{ uri: photoUri }}
            style={styles.photo}
            contentFit="cover"
            cachePolicy="disk"
          />
        ) : (
          <Ionicons name="image-outline" size={32} color="#8D7D78" />
        )}
      </View>

      <Text style={styles.cardTitle} numberOfLines={2}>
        {complaint?.title || 'Denúncia sem título'}
      </Text>
      <Text style={styles.cardDescription} numberOfLines={4}>
        {complaint?.description || 'Sem descrição informada.'}
      </Text>

      <View style={styles.metaRow}>
        <Ionicons name="location-outline" size={16} color="#8D7D78" />
        <Text style={styles.metaText} numberOfLines={2}>
          {locationLabel}
        </Text>
      </View>

      {complaint?.createdByUsername ? (
        <View style={styles.metaRow}>
          <Ionicons name="person-outline" size={16} color="#8D7D78" />
          <Text style={styles.metaText} numberOfLines={1}>
            @{complaint.createdByUsername}
          </Text>
        </View>
      ) : null}

      <View style={styles.metaRow}>
        <Ionicons name="flag-outline" size={16} color="#8D7D78" />
        <Text style={styles.metaText}>
          {reportCount} {reportCount === 1 ? 'report' : 'reports'}
        </Text>
      </View>

      <View style={styles.actionsRow}>
        {Object.entries(MODERATION_ACTIONS).map(([action, config]) => (
          <Pressable
            key={action}
            style={[styles.actionButton, { borderColor: config.color }]}
            onPress={() => onAction(item, action)}
            accessibilityRole="button"
            accessibilityLabel={`${config.label} denúncia`}
          >
            <Ionicons name={config.icon} size={18} color={config.color} />
            <Text style={[styles.actionText, { color: config.color }]}>
              {config.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
