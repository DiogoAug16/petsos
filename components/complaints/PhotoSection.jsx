import { useUploadUrl } from '@/hooks/useUploadUrl';
import { FORM_COLORS, formStyles } from '@/styles/form/form.styles';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function PhotoSection({ photos, setPhotos, maxPhotos = 5 }) {
  const uploadUrl = useUploadUrl();

  const resolvePhotoUri = (uri) => {
    if (!uri) return '';
    if (/^(https?:|file:|content:|data:)/i.test(uri)) return uri;
    if (!uploadUrl) return uri;

    const baseUrl = uploadUrl.endsWith('/') ? uploadUrl.slice(0, -1) : uploadUrl;
    const path = uri.startsWith('/') ? uri : `/${uri}`;
    return `${baseUrl}${path}`;
  };

  const pickFromGallery = async () => {
    try {
      if (photos.length >= maxPhotos) {
        Alert.alert('Limite atingido', `Você pode adicionar no máximo ${maxPhotos} fotos.`);
        return;
      }

      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert('Permissão negada', 'Permita acesso à galeria.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: maxPhotos - photos.length,
      });

      if (!result.canceled && result.assets?.length) {
        const selectedUris = result.assets.map((asset) => asset.uri);

        setPhotos((prev) => {
          const merged = [...prev, ...selectedUris];
          const unique = [...new Set(merged)];
          return unique.slice(0, maxPhotos);
        });
      }
    } catch (error) {
      console.log('Erro ao abrir galeria:', error);
      Alert.alert('Erro', 'Não foi possível abrir a galeria.');
    }
  };

  const takePhoto = async () => {
    try {
      if (photos.length >= maxPhotos) {
        Alert.alert('Limite atingido', `Você pode adicionar no máximo ${maxPhotos} fotos.`);
        return;
      }

      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert('Permissão negada', 'Permita acesso à câmera.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length) {
        const newUri = result.assets[0].uri;

        setPhotos((prev) => {
          const merged = [...prev, newUri];
          const unique = [...new Set(merged)];
          return unique.slice(0, maxPhotos);
        });
      }
    } catch (error) {
      console.log('Erro ao abrir câmera:', error);
      Alert.alert('Erro', 'Não foi possível abrir a câmera.');
    }
  };

  const removePhoto = (uriToRemove) => {
    setPhotos((prev) => prev.filter((uri) => uri !== uriToRemove));
  };

  return (
    <View style={formStyles.card}>
      <View style={styles.photosHeader}>
        <Text style={formStyles.label}>FOTOS DE EVIDÊNCIA</Text>
        <Text style={styles.counter}>
          {photos.length}/{maxPhotos}
        </Text>
      </View>

      <View style={styles.photoActions}>
        <Pressable style={styles.secondaryButton} onPress={pickFromGallery}>
          <Text style={styles.secondaryButtonText}>Galeria</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={takePhoto}>
          <Text style={styles.secondaryButtonText}>Câmera</Text>
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.photosRow}>
          {photos.length < maxPhotos && (
            <Pressable style={styles.addPhotoBox} onPress={pickFromGallery}>
              <Text style={styles.addPhotoPlus}>+</Text>
              <Text style={styles.addPhotoText}>Adicionar</Text>
            </Pressable>
          )}

          {photos.map((uri, index) => (
            <View key={`${uri}-${index}`} style={styles.photoWrapper}>
              <Image
                source={{ uri: resolvePhotoUri(uri) }}
                style={styles.photo}
                contentFit="cover"
                cachePolicy="memory-disk"
                transition={120}
              />
              <Pressable
                style={styles.removePhotoButton}
                onPress={() => removePhoto(uri)}
              >
                <Text style={styles.removePhotoButtonText}>×</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  photosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  counter: {
    fontSize: 11,
    color: FORM_COLORS.muted,
  },
  photoActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: FORM_COLORS.background,
    borderWidth: 0.5,
    borderColor: FORM_COLORS.border,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  secondaryButtonText: {
    color: FORM_COLORS.text,
    fontWeight: '600',
    fontSize: 13,
  },
  photosRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  addPhotoBox: {
    width: 72,
    height: 72,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: FORM_COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: FORM_COLORS.background,
  },
  addPhotoPlus: {
    fontSize: 22,
    color: FORM_COLORS.placeholder,
    fontWeight: '400',
  },
  addPhotoText: {
    fontSize: 9,
    color: FORM_COLORS.placeholder,
  },
  photoWrapper: {
    width: 72,
    height: 72,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removePhotoButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 14,
  },
});
