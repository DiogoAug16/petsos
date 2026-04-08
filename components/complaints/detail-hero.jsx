import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, Text, View } from 'react-native';
import { useUploadUrl } from '@/hooks/useUploadUrl';

export function DetailHero({ complaint, type, emoji, styles, theme, onBack, onShare }) {
  const UPLOAD_URL = useUploadUrl();

  return (
    <View style={styles.detailHero}>
      {complaint.photos?.length > 0 ? (
        <Image 
          source={{ uri: `${UPLOAD_URL}${complaint.photos[0]}` }} 
          style={styles.detailHeroImage}
          resizeMode="cover"
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
