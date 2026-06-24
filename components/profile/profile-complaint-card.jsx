import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { useAddress } from '@/hooks/useAddress';
import { useComplaintConfig } from '@/hooks/useComplaintConfig';
import { useHaptics } from '@/hooks/useHaptics';
import { usePressAnimation } from '@/hooks/usePressAnimation';
import { useUploadUrl } from '@/hooks/useUploadUrl';
import { buildUploadPhotoUri, getComplaintCoverPhoto } from '@/utils/photo.utils';
import { cleanStatusLabel } from '@/utils/status.utils';

export function ProfileComplaintCard({ complaint, styles }) {
  const router = useRouter();
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation();
  const { triggerHaptics } = useHaptics();
  const { address } = useAddress(complaint.location);
  const { status, type, emoji } = useComplaintConfig(complaint);
  const uploadUrl = useUploadUrl();

  const photoUri = buildUploadPhotoUri(
    getComplaintCoverPhoto(complaint, { preferThumbnail: true }),
    uploadUrl
  );
  const handlePressIn = () => {
    onPressIn();
    triggerHaptics('soft');
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={onPressOut}
      onPress={() => router.push(`/complaint/${complaint.id}`)}
      accessibilityRole="button"
      accessibilityLabel={`Abrir denúncia ${complaint.title}`}
    >
      <Animated.View style={[styles.card, animatedStyle]}>
        <View style={[styles.cardThumb, { backgroundColor: type.photoColor }]}>
          {photoUri ? (
            <Image
              source={{ uri: photoUri }}
              style={styles.cardThumb}
              contentFit="cover"
              cachePolicy="disk"
              transition={120}
            />
          ) : (
            <Text style={styles.cardEmoji}>{emoji}</Text>
          )}
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {complaint.title}
          </Text>
          <View style={styles.cardMetaRow}>
            <View style={styles.statusPill}>
              <Text style={styles.statusText}>{cleanStatusLabel(status.label)}</Text>
            </View>
            <Ionicons name="location-outline" size={13} color="#8D7D78" />
            <Text style={styles.cardAddress} numberOfLines={1}>
              {address || 'Localização'}
            </Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={18} color="#8D7D78" />
      </Animated.View>
    </Pressable>
  );
}
