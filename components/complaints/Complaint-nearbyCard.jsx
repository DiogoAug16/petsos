import { useRouter } from 'expo-router';
import { memo } from 'react';
import { Image, Pressable, Text, View, useColorScheme } from 'react-native';
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
          {complaint.photos?.length > 0 ? (
            <Image
              source={{ uri: `${UPLOAD_URL}${complaint.photos[0]}` }}
              style={{ width: '100%', height: '100%', borderRadius: 14 }}
              resizeMode="cover"
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