import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';
import { useUploadUrl } from '@/hooks/useUploadUrl';

export function DetailHero({ complaint, type, emoji, styles, theme, onBack, onShare }) {
  const UPLOAD_URL = useUploadUrl();
  const resolvePhotoUri = (photoPath) => {
    if (!photoPath) return null;
    if (/^(https?:|file:|content:|data:)/i.test(photoPath)) return photoPath;
    if (!UPLOAD_URL) return photoPath;

    const baseUrl = UPLOAD_URL.endsWith('/') ? UPLOAD_URL.slice(0, -1) : UPLOAD_URL;
    const normalizedPath = photoPath.startsWith('/') ? photoPath : `/${photoPath}`;
    return `${baseUrl}${normalizedPath}`;
  };
  const coverPhotoUri = resolvePhotoUri(complaint.photos?.[0]);

  return (
    <View style={styles.detailHero}>
      {coverPhotoUri ? (
        <Image 
          source={{ uri: coverPhotoUri }} 
          style={styles.detailHeroImage}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={120}
        />
      ) : (
        <View style={[styles.detailHeroContent, { backgroundColor: type.photoColor }]}>
          <Text style={styles.detailHeroEmoji}>{emoji}</Text>
        </View>
      )}

      <View style={styles.detailHeroHeader}>
        <Pressable style={styles.detailIconButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color={theme.text} />
        </Pressable>
        
        <Pressable style={styles.detailIconButton} onPress={onShare}>
          <Ionicons name="share-outline" size={20} color={theme.text} />
        </Pressable>
      </View>
    </View>
  );
}
