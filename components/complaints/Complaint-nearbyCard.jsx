import { useRouter } from 'expo-router';
import { memo } from 'react';
import { Image } from 'expo-image';
import { Pressable, Text, View, useColorScheme } from 'react-native';
import Animated from 'react-native-reanimated';

import { useAddress } from '@/hooks/useAddress';
import { useComplaintConfig } from '@/hooks/useComplaintConfig';
import { useHaptics } from '@/hooks/useHaptics';
import { usePressAnimation } from '@/hooks/usePressAnimation';
import { useUploadUrl } from '@/hooks/useUploadUrl';
import { complaintsStyles } from '@/styles/complaints';
import { formatDate } from '@/utils/date.utils';

function ComplaintNearbyCardComponent({ complaint }) {
  const { address, loadingAddress } = useAddress(complaint.location);
  const { status, type, emoji } = useComplaintConfig(complaint);
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation();
  const { triggerHaptics } = useHaptics();
  const UPLOAD_URL = useUploadUrl();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const styles = complaintsStyles(colorScheme);

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
      <Animated.View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
            borderRadius: 20,
            backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#FFFFFF',
          },
          animatedStyle,
        ]}
      >
        <View
          style={[
            styles.cardPhoto,
            {
              width: 56,
              height: 56,
              borderRadius: 14,
              backgroundColor: type.photoColor,
            },
          ]}
        >
          {coverPhotoUri ? (
            <Image
              source={{ uri: coverPhotoUri }}
              style={{ width: '100%', height: '100%', borderRadius: 14 }}
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={120}
            />
          ) : (
            <Text style={[styles.cardPhotoEmoji, { fontSize: 24 }]}>
              {emoji}
            </Text>
          )}
        </View>

        <View style={{ flex: 1, marginHorizontal: 12 }}>
        
          <Text numberOfLines={1} style={[styles.cardTitle, { fontSize: 12 }]}>
            {complaint.title}
          </Text>

          {address && (
            <Text
              numberOfLines={1}
              style={[
                styles.cardAddress,
                loadingAddress && styles.cardAddressMuted,
              ]}
            >
              📍 {address}
            </Text>
          )}

          <Text style={styles.cardDate}>
            {formatDate(complaint.createdAt)}
          </Text>
        </View>

        <View style={styles[status.container]}>
          <Text style={styles[status.text]}>{status.label}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export const ComplaintNearbyCard = memo(ComplaintNearbyCardComponent);
