import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

export function EvidencePhotoActions({ onPickFromGallery, onTakePhoto, styles }) {
  return (
    <View style={styles.photoActions}>
      <Pressable style={styles.photoButton} onPress={onPickFromGallery}>
        <Ionicons name="images-outline" size={16} color="#555" />
        <Text style={styles.photoButtonText}>Galeria</Text>
      </Pressable>
      <Pressable style={styles.photoButton} onPress={onTakePhoto}>
        <Ionicons name="camera-outline" size={16} color="#555" />
        <Text style={styles.photoButtonText}>Câmera</Text>
      </Pressable>
    </View>
  );
}
