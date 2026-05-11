import { Image } from 'expo-image';
import { ScrollView, StyleSheet } from 'react-native';
import { useUploadUrl } from '@/hooks/useUploadUrl';
import { buildUploadPhotoUri } from '@/utils/photo.utils';

export default function ComplaintPhotos({ photos, onPhotoError }) {
  const UPLOAD_URL = useUploadUrl();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {photos.map((uri, index) => {
        const resolvedUri = buildUploadPhotoUri(uri, UPLOAD_URL);
        if (!resolvedUri) return null;

        return (
          <Image
            key={`${uri}-${index}`}
            source={{ uri: resolvedUri }}
            style={styles.photo}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={120}
            onError={() => onPhotoError?.(uri)}
          />
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  photo: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginRight: 10,
  },
});
