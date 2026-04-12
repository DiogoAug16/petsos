import { Image } from 'expo-image';
import { ScrollView, StyleSheet } from 'react-native';
import { useUploadUrl } from '@/hooks/useUploadUrl';

export default function ComplaintPhotos({ photos }) {
  const UPLOAD_URL = useUploadUrl();
  const resolvePhotoUri = (photoPath) => {
    if (!photoPath) return null;
    if (/^(https?:|file:|content:|data:)/i.test(photoPath)) return photoPath;
    if (!UPLOAD_URL) return photoPath;

    const baseUrl = UPLOAD_URL.endsWith('/') ? UPLOAD_URL.slice(0, -1) : UPLOAD_URL;
    const normalizedPath = photoPath.startsWith('/') ? photoPath : `/${photoPath}`;
    return `${baseUrl}${normalizedPath}`;
  };
  
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {photos.map((uri, index) => (
        <Image 
          key={`${uri}-${index}`} 
          source={{ uri: resolvePhotoUri(uri) }} 
          style={styles.photo} 
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={120}
        />
      ))}
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
