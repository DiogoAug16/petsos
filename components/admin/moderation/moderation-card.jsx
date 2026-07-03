import { getModerationActions } from '@/constants/admin/moderation.constants';
import { REPORT_REASON_LABELS } from '@/constants/complaints/report-reasons.constants';
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
  const isCommentReport = item?.targetType === 'comment';
  const actions = getModerationActions(item);
  const reportReason =
    REPORT_REASON_LABELS[item?.latestReportReason] || item?.latestReportReason;
  const reportedCommentText =
    item?.reportedCommentText || item?.latestReportedCommentText;

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
        {isCommentReport ? 'Comentário reportado' : complaint?.title || 'Denúncia sem título'}
      </Text>
      <Text style={styles.cardDescription} numberOfLines={4}>
        {isCommentReport
          ? reportedCommentText || 'Comentário sem texto disponível.'
          : complaint?.description || 'Sem descrição informada.'}
      </Text>

      {isCommentReport && complaint?.title ? (
        <View style={styles.metaRow}>
          <Ionicons name="alert-circle-outline" size={16} color="#8D7D78" />
          <Text style={styles.metaText} numberOfLines={2}>
            Na denúncia: {complaint.title}
          </Text>
        </View>
      ) : null}

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

      {reportReason ? (
        <View style={styles.metaRow}>
          <Ionicons name="information-circle-outline" size={16} color="#8D7D78" />
          <Text style={styles.metaText} numberOfLines={2}>
            Motivo: {reportReason}
          </Text>
        </View>
      ) : null}

      <View style={styles.actionsRow}>
        {Object.entries(actions).map(([action, config]) => (
          <Pressable
            key={action}
            style={[styles.actionButton, { borderColor: config.color }]}
            onPress={() => onAction(item, action)}
            accessibilityRole="button"
            accessibilityLabel={`${config.label} ${
              isCommentReport ? 'comentário' : 'denúncia'
            }`}
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
