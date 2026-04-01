import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

export function usePhotoUpload() {
  const [imageUri, setImageUri] = useState(null);

  const handleResult = (result) => {
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        alert('Permissão para acessar a galeria negada.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 1,
      });

      handleResult(result);
    } catch (error) {
      console.log('Erro ao abrir galeria:', error);
    }
  };

  const takePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        alert('Permissão para acessar a câmera negada.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });

      handleResult(result);
    } catch (error) {
      console.log('Erro ao abrir câmera:', error);
    }
  };

  const removePhoto = () => {
    setImageUri(null);
  };

  return {
    imageUri,
    pickImageFromGallery,
    takePhoto,
    removePhoto,
  };
}