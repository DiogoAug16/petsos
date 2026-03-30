import { StyleSheet, Text, TextInput, View } from 'react-native';
import PhotoPicker from '../../components/PhotoPicker';
import { usePhotoUpload } from '../../hooks/usePhotoUpload';

export default function CreateComplaintScreen() {
  const {
    imageUri,
    pickImageFromGallery,
    takePhoto,
    removePhoto,
  } = usePhotoUpload();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar denúncia</Text>

      <TextInput
        placeholder="Título da denúncia"
        style={styles.input}
      />

      <TextInput
        placeholder="Descrição"
        style={[styles.input, styles.textArea]}
        multiline
        numberOfLines={4}
      />

      <PhotoPicker
        imageUri={imageUri}
        onPickGallery={pickImageFromGallery}
        onTakePhoto={takePhoto}
        onRemove={removePhoto}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});