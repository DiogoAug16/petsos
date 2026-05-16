import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { useAddress } from '@/hooks/useAddress';
import { useComplaintConfig } from '@/hooks/useComplaintConfig';
import { useUploadUrl } from '@/hooks/useUploadUrl';
import { buildUploadPhotoUri } from '@/utils/photo.utils';
import { cleanStatusLabel } from '@/utils/status.utils';

export function ProfileComplaintCard({ complaint, styles }) {
  const router = useRouter();
  const { address } = useAddress(complaint.location);
  const { status, type, emoji } = useComplaintConfig(complaint);
  const uploadUrl = useUploadUrl();

  const photoUri = buildUploadPhotoUri(complaint.photos?.[0], uploadUrl);

  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/complaint/${complaint.id}`)}
    >
      <View style={[styles.cardThumb, { backgroundColor: type.photoColor }]}>
        {photoUri ? (
          <Image
            source={{ uri: photoUri }}
            style={styles.cardThumb}
            contentFit="cover"
            cachePolicy="memory-disk"
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
          <Ionicons name="location-outline" size={13} color="#8A8A8E" />
          <Text style={styles.cardAddress} numberOfLines={1}>
            {address || 'Localização'}
          </Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={18} color="#5F5F64" />
    </Pressable>
  );
}
