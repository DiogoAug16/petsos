import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import PhotoPicker from '../../components/PhotoPicker';
import Button from '../../components/ui/Button';
import { usePhotoUpload } from '../../hooks/usePhotoUpload';
import { createComplaint } from '../../services/complaints.service';

export default function CreateComplaintScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const {
    imageUri,
    pickImageFromGallery,
    takePhoto,
    removePhoto,
  } = usePhotoUpload();

  const handleSubmit = async () => {
    try {
      const payload = {
        title,
        description,
        type: 'outro',
        latitude: -15.601411,
        longitude: -56.097892,
        imageUri,
      };

      const result = await createComplaint(payload);

      console.log('Denúncia criada:', result);
      alert('Denúncia enviada com sucesso!');
    } catch (error) {
      console.log(error);
      alert('Erro ao enviar denúncia');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar denúncia</Text>

      <TextInput
        placeholder="Título da denúncia"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        placeholder="Descrição"
        style={[styles.input, styles.textArea]}
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
      />

      <PhotoPicker
        imageUri={imageUri}
        onPickGallery={pickImageFromGallery}
        onTakePhoto={takePhoto}
        onRemove={removePhoto}
      />

      <Button
        title="Enviar denúncia"
        onPress={handleSubmit}
        style={styles.submitButton}
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
  submitButton: {
    marginTop: 16,
  },
});