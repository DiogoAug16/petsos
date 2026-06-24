import { Image } from 'expo-image';
import { Pressable, ScrollView, Text, View } from 'react-native';

export function EvidencePhotoList({ photos, onRemovePhoto, styles }) {
  if (photos.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.photosScroll}
    >
      {photos.map((uri, index) => (
        <View key={`${uri}-${index}`} style={styles.photoWrapper}>
          <Image source={{ uri }} style={styles.photo} contentFit="cover" />
          <Pressable
            style={styles.removeButton}
            onPress={() => onRemovePhoto(uri)}
          >
            <Text style={styles.removeButtonText}>×</Text>
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
}
