import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
 Image as RNImage } from 'react-native';
import Toast from 'react-native-toast-message';

import { submitEvidence } from '@/services/complaint-evidence.service';

const MAX_PHOTOS = 5;
const MIN_DESCRIPTION = 20;
const MAX_UPLOAD_DIMENSION = 1280;
const JPEG_QUALITY = 0.72;

const getImageSize = (uri) =>
  new Promise((resolve, reject) => {
    RNImage.getSize(uri, (w, h) => resolve({ width: w, height: h }), reject);
  });

const compressPhoto = async (uri) => {
  let actions = [];
  try {
    const { width, height } = await getImageSize(uri);
    const larger = Math.max(width, height);
    if (larger > MAX_UPLOAD_DIMENSION) {
      actions =
        width >= height
          ? [{ resize: { width: MAX_UPLOAD_DIMENSION } }]
          : [{ resize: { height: MAX_UPLOAD_DIMENSION } }];
    }
  } catch {
    actions = [];
  }

  const result = await ImageManipulator.manipulateAsync(uri, actions, {
    compress: JPEG_QUALITY,
    format: ImageManipulator.SaveFormat.JPEG,
  });
  return result.uri;
};

export function EvidenceSubmitModal({ visible, complaintId, onClose, onSubmitted }) {
  const [photos, setPhotos] = useState([]);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isValid = photos.length >= 1 && description.trim().length >= MIN_DESCRIPTION;

  const pickFromGallery = async () => {
    if (photos.length >= MAX_PHOTOS) {
      Alert.alert('Limite atingido', `Máximo de ${MAX_PHOTOS} fotos.`);
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
      selectionLimit: MAX_PHOTOS - photos.length,
    });

    if (!result.canceled && result.assets?.length) {
      const uris = result.assets.map((a) => a.uri);
      setPhotos((prev) => [...new Set([...prev, ...uris])].slice(0, MAX_PHOTOS));
    }
  };

  const takePhoto = async () => {
    if (photos.length >= MAX_PHOTOS) {
      Alert.alert('Limite atingido', `Máximo de ${MAX_PHOTOS} fotos.`);
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
      setPhotos((prev) =>
        [...new Set([...prev, result.assets[0].uri])].slice(0, MAX_PHOTOS),
      );
    }
  };

  const removePhoto = (uri) => {
    setPhotos((prev) => prev.filter((p) => p !== uri));
  };

  const handleSubmit = async () => {
    if (!isValid || submitting) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('description', description.trim());

      const compressed = await Promise.all(
        photos.map(async (uri, index) => {
          const converted = await compressPhoto(uri);
          const fixed = converted.startsWith('file://') ? converted : `file://${converted}`;
          return { uri: fixed, name: `evidencia_${index}.jpg`, type: 'image/jpeg' };
        }),
      );

      compressed.forEach((photo) => formData.append('photos', photo));

      await submitEvidence(complaintId, formData);

      Toast.show({
        type: 'success',
        text1: 'Evidência enviada',
        text2: 'Aguardando validação do criador da denúncia.',
      });

      setPhotos([]);
      setDescription('');
      onSubmitted?.();
      onClose();
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: err?.message || 'Não foi possível enviar a evidência.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onClose} disabled={submitting}>
            <Ionicons name="close" size={24} color="#333" />
          </Pressable>
          <Text style={styles.title}>Enviar Evidência</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.label}>FOTOS DA EVIDÊNCIA</Text>
          <Text style={styles.hint}>
            {photos.length}/{MAX_PHOTOS} fotos (mínimo 1)
          </Text>

          <View style={styles.photoActions}>
            <Pressable style={styles.photoButton} onPress={pickFromGallery}>
              <Ionicons name="images-outline" size={16} color="#555" />
              <Text style={styles.photoButtonText}>Galeria</Text>
            </Pressable>
            <Pressable style={styles.photoButton} onPress={takePhoto}>
              <Ionicons name="camera-outline" size={16} color="#555" />
              <Text style={styles.photoButtonText}>Câmera</Text>
            </Pressable>
          </View>

          {photos.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.photosScroll}
            >
              {photos.map((uri, index) => (
                <View key={`${uri}-${index}`} style={styles.photoWrapper}>
                  <Image
                    source={{ uri }}
                    style={styles.photo}
                    contentFit="cover"
                  />
                  <Pressable
                    style={styles.removeButton}
                    onPress={() => removePhoto(uri)}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          )}

          <Text style={[styles.label, { marginTop: 24 }]}>DESCRIÇÃO</Text>
          <Text style={styles.hint}>
            {description.trim().length}/{MIN_DESCRIPTION} caracteres mínimos
          </Text>

          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="Descreva o que foi feito para resolver a denúncia..."
            placeholderTextColor="#999"
            multiline
            textAlignVertical="top"
          />
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={[styles.submitButton, !isValid && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!isValid || submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Enviar Evidência</Text>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0D8BF',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#272A3A',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8D7D78',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  hint: {
    fontSize: 12,
    color: '#8D7D78',
    marginBottom: 12,
  },
  photoActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF6EC',
    borderWidth: 0.5,
    borderColor: '#F0D8BF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  photoButtonText: {
    color: '#555',
    fontWeight: '600',
    fontSize: 13,
  },
  photosScroll: {
    marginBottom: 8,
  },
  photoWrapper: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 8,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#FFF6EC',
    borderWidth: 0.5,
    borderColor: '#F0D8BF',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: '#272A3A',
    minHeight: 120,
  },
  footer: {
    padding: 16,
    paddingBottom: 34,
    borderTopWidth: 0.5,
    borderTopColor: '#F0D8BF',
  },
  submitButton: {
    backgroundColor: '#FF9F1C',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
