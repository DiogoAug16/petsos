import { useAddress } from '@/hooks/complaints/useAddress';
import { useColorScheme } from '@/hooks/ui/useColorScheme';
import { useHaptics } from '@/hooks/ui/useHaptics';
import { usePressAnimation } from '@/hooks/ui/usePressAnimation';
import { useUploadUrl } from '@/hooks/shared/useUploadUrl';
import { useComplaintConfig } from '@/hooks/complaints/useComplaintConfig';
import { StatusBadge } from '@/components/complaints/list/status-badge';
import { complaintsStyles } from '@/styles/complaints';
import { formatDate } from '@/utils/shared/date.utils';
import { getComplaintCoverPhoto } from '@/utils/media/photo.utils';
import { writeLocalCache } from '@/utils/shared/local-cache';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

function ComplaintCardComponent({ complaint }) {
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation();
  const { address, loadingAddress } = useAddress(complaint.location);
  const router = useRouter();
  const { triggerHaptics } = useHaptics();
  const colorScheme = useColorScheme();
  const styles = complaintsStyles(colorScheme);
  const UPLOAD_URL = useUploadUrl();
  const { type, emoji } = useComplaintConfig(complaint);
  const complaintId = complaint.id ?? complaint._id;

  const resolvePhotoUri = (photoPath) => {
    if (!photoPath) return null;
    if (/^(https?:|file:|content:|data:)/i.test(photoPath)) return photoPath;
    if (!UPLOAD_URL) return photoPath;

    const baseUrl = UPLOAD_URL.endsWith('/') ? UPLOAD_URL.slice(0, -1) : UPLOAD_URL;
    const normalizedPath = photoPath.startsWith('/') ? photoPath : `/${photoPath}`;
    return `${baseUrl}${normalizedPath}`;
  };

  const coverPhotoUri = resolvePhotoUri(
    getComplaintCoverPhoto(complaint, { preferThumbnail: true })
  );

  const handlePressIn = () => {
    onPressIn();
    triggerHaptics('soft');
  };

  const handlePress = () => {
    if (!complaintId) return;
    writeLocalCache(`complaint:detail:${complaintId}`, complaint);
    router.push(`/complaint/${complaintId}`);
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={onPressOut}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`Abrir denúncia ${complaint.title}`}
    >
      <Animated.View style={[styles.card, animatedStyle]}>
        <View style={styles.cardTop}>
          <View style={[styles.cardPhoto, { backgroundColor: type.photoColor }]}>
            {coverPhotoUri ? (
              <Image
                source={{ uri: coverPhotoUri }}
                style={styles.cardPhotoImage}
                contentFit="cover"
                cachePolicy="disk"
                transition={120}
              />
            ) : (
              <Text style={styles.cardPhotoEmoji}>{emoji}</Text>
            )}
          </View>

          <View style={styles.cardBody}>
            <View style={[styles.badgeBase, styles[type.badge]]}>
              <Text style={[styles.badgeTextBase, styles[type.badgeText]]}>
                {type.label}
              </Text>
            </View>

            <Text style={styles.cardTitle} numberOfLines={2}>
              {complaint.title}
            </Text>

            {address && (
              <Text
                style={[
                  styles.cardAddress,
                  loadingAddress && styles.cardAddressMuted,
                ]}
                numberOfLines={1}
              >
                📍 {address}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.cardFooter}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="time-outline" size={14} style={styles.cardDate} />
            <Text style={styles.cardDate}>{formatDate(complaint.createdAt)}</Text>
          </View>

          <StatusBadge status={complaint.status} styles={styles} />
        </View>
      </Animated.View>
    </Pressable>
  );
}

export const ComplaintCard = memo(ComplaintCardComponent);
