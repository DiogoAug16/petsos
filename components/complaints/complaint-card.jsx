import { useAddress } from '@/hooks/useAddress';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useHaptics } from '@/hooks/useHaptics';
import { usePressAnimation } from '@/hooks/usePressAnimation';
import { useUploadUrl } from '@/hooks/useUploadUrl';
import { useComplaintConfig } from '@/hooks/useComplaintConfig';
import { complaintsStyles } from '@/styles/complaints';
import { formatDate } from '@/utils/date.utils';
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
  const { status, type, emoji } = useComplaintConfig(complaint);

  const resolvePhotoUri = (photoPath) => {
    if (!photoPath) return null;
    if (/^(https?:|file:|content:|data:)/i.test(photoPath)) return photoPath;
    if (!UPLOAD_URL) return photoPath;

    const baseUrl = UPLOAD_URL.endsWith('/') ? UPLOAD_URL.slice(0, -1) : UPLOAD_URL;
    const normalizedPath = photoPath.startsWith('/') ? photoPath : `/${photoPath}`;
    return `${baseUrl}${normalizedPath}`;
  };

  const coverPhotoUri = resolvePhotoUri(complaint.photos?.[0]);

  const handlePressIn = () => {
    onPressIn();
    triggerHaptics('soft');
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={onPressOut}
      onPress={() => router.push(`/complaint/${complaint.id}`)}
    >
      <Animated.View style={[styles.card, animatedStyle]}>
        <View style={styles.cardTop}>
          <View style={[styles.cardPhoto, { backgroundColor: type.photoColor }]}>
            {coverPhotoUri ? (
              <Image
                source={{ uri: coverPhotoUri }}
                style={styles.cardPhoto}
                contentFit="cover"
                cachePolicy="memory-disk"
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

          <View style={styles[status.container]}>
            <Text style={styles[status.text]}>{status.label}</Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export const ComplaintCard = memo(ComplaintCardComponent);
