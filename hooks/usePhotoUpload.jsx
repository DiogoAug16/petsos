import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

export function usePhotoUpload() {
  const [images, setImages] = useState([]);

  const pickImagesFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert('Permissão para acessar a galeria negada.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 1,
      selectionLimit: 5,
    });

    if (!result.canceled) {
      const selectedImages = result.assets.map((asset) => asset.uri);
      setImages((prev) => [...prev, ...selectedImages]);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      alert('Permissão para acessar a câmera negada.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newImage = result.assets[0].uri;
      setImages((prev) => [...prev, newImage]);
    }
  };

  const removeImage = (uriToRemove) => {
    setImages((prev) => prev.filter((uri) => uri !== uriToRemove));
  };

  return {
    images,
    pickImagesFromGallery,
    takePhoto,
    removeImage,
  };
}