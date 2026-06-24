import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { useComplaintConfig } from '@/hooks/complaints/useComplaintConfig';
import { useUploadUrl } from '@/hooks/shared/useUploadUrl';
import { buildUploadPhotoUri, getComplaintCoverPhoto } from '@/utils/media/photo.utils';

export function MapComplaintPreview({
  complaint,
  styles,
  onClose,
  onDetails,
  onRoute,
  routeActive = false,
  routeLoading = false,
}) {
  const { type, emoji } = useComplaintConfig(complaint);
  const uploadUrl = useUploadUrl();
  const coverPhotoUri = buildUploadPhotoUri(
    getComplaintCoverPhoto(complaint, { preferThumbnail: true }),
    uploadUrl
  );

  if (!complaint) return null;

  return (
    <View style={styles.markerPreview}>
      <Pressable
        style={styles.markerPreviewClose}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Fechar opções da denúncia"
      >
        <Text style={styles.markerPreviewCloseText}>x</Text>
      </Pressable>

      <View style={styles.markerPreviewTop}>
        <View style={[styles.markerPreviewPhoto, { backgroundColor: type.photoColor }]}>
          {coverPhotoUri ? (
            <Image
              source={{ uri: coverPhotoUri }}
              style={styles.markerPreviewImage}
              contentFit="cover"
              cachePolicy="disk"
              transition={120}
            />
          ) : (
            <Text style={styles.markerPreviewEmoji}>{emoji}</Text>
          )}
        </View>

        <View style={styles.markerPreviewCopy}>
          <Text style={styles.markerPreviewType}>{type.label}</Text>
          <Text style={styles.markerPreviewTitle} numberOfLines={2}>
            {complaint.title}
          </Text>
        </View>
      </View>

      <View style={styles.markerPreviewActions}>
        <Pressable
          style={styles.markerPreviewSecondaryButton}
          onPress={onDetails}
          accessibilityRole="button"
          accessibilityLabel="Ver informações da denúncia"
        >
          <Ionicons name="document-text-outline" size={18} color="#272A3A" />
          <Text style={styles.markerPreviewSecondaryText}>Informações</Text>
        </Pressable>

        <Pressable
          style={[
            styles.markerPreviewPrimaryButton,
            routeLoading && { opacity: 0.72 },
          ]}
          onPress={onRoute}
          disabled={routeLoading}
          accessibilityRole="button"
          accessibilityLabel={
            routeActive ? 'Desfazer rota até a denúncia' : 'Traçar rota até a denúncia'
          }
        >
          {routeLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons
              name={routeActive ? 'close-circle-outline' : 'navigate-outline'}
              size={18}
              color="#FFFFFF"
            />
          )}
          <Text style={styles.markerPreviewPrimaryText}>
            {routeLoading ? 'Traçando…' : routeActive ? 'Desfazer rota' : 'Rota'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
