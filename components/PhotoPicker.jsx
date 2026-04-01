import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import Colors from '../constants/Colors';
import Button from './ui/Button';

export default function PhotoPicker({
  images = [],
  onPickGallery,
  onTakePhoto,
  onRemove,
}) {
  const theme = useColorScheme() || 'light';
  const colors = Colors[theme];

  const styles = StyleSheet.create({
    container: {
      gap: 12,
    },
    previewContainer: {
      marginTop: 8,
    },
    imageWrapper: {
      position: 'relative',
      marginRight: 10,
    },
    preview: {
      width: 140,
      height: 140,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.tabIconDefault,
    },
    removeButton: {
      position: 'absolute',
      top: 6,
      right: 6,
      backgroundColor: 'rgba(0,0,0,0.7)',
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    removeButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 12,
    },
  });

  return (
    <View style={styles.container}>
      <Button
        title="Selecionar da galeria"
        onPress={onPickGallery}
      />

      <Button
        title="Tirar foto"
        onPress={onTakePhoto}
      />

      {images.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.previewContainer}
        >
          {images.map((uri, index) => (
            <View key={`${uri}-${index}`} style={styles.imageWrapper}>
              <Image source={{ uri }} style={styles.preview} />

              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => onRemove(uri)}
              >
                <Text style={styles.removeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}