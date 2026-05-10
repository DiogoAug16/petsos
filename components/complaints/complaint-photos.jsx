import { Image } from 'expo-image';
import { ScrollView, StyleSheet } from 'react-native';
import { useUploadUrl } from '@/hooks/useUploadUrl';

const getPhotoPath = (photo) => {
  if (typeof photo === 'string') return photo;
  if (!photo || typeof photo !== 'object') return null;
  return photo.url || photo.uri || photo.path || photo.filePath || null;
};

export default function ComplaintPhotos({ photos, onPhotoError }) {
  const UPLOAD_URL = useUploadUrl();
  const resolvePhotoUri = (photo) => {
    const photoPath = getPhotoPath(photo);
    if (!photoPath) return null;
    if (/^(https?:|file:|content:|data:)/i.test(photoPath)) return photoPath;
    if (!UPLOAD_URL) return photoPath;

    const baseUrl = UPLOAD_URL.endsWith('/') ? UPLOAD_URL.slice(0, -1) : UPLOAD_URL;
    const normalizedPath = photoPath.startsWith('/') ? photoPath : `/${photoPath}`;
    return `${baseUrl}${normalizedPath}`;
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {photos.map((uri, index) => {
        const resolvedUri = resolvePhotoUri(uri);
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
