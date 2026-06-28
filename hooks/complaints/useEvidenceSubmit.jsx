import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert } from 'react-native';

import {
  EVIDENCE_SUBMIT_MAX_PHOTOS,
  EVIDENCE_SUBMIT_MIN_DESCRIPTION,
} from '@/constants/complaints/complaint-evidence-submit.constants';
import { useRequireVerifiedEmail } from '@/hooks/auth/useRequireVerifiedEmail';
import { submitEvidence } from '@/services/complaints/complaint-evidence.service';
import {
  compressEvidencePhoto,
  toEvidenceUploadFile,
} from '@/utils/complaints/evidence-submit.utils';

export function useEvidenceSubmit({ complaintId, onClose, onSubmitted }) {
  const requireVerifiedEmail = useRequireVerifiedEmail();
  const [photos, setPhotos] = useState([]);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isValid =
    photos.length >= 1 &&
    description.trim().length >= EVIDENCE_SUBMIT_MIN_DESCRIPTION;

  const ensureCanAddPhoto = () => {
    if (photos.length < EVIDENCE_SUBMIT_MAX_PHOTOS) return true;

    Alert.alert('Limite atingido', `Máximo de ${EVIDENCE_SUBMIT_MAX_PHOTOS} fotos.`);
    return false;
  };

  const pickFromGallery = async () => {
    if (!ensureCanAddPhoto()) return;

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão negada', 'Permita acesso à galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: EVIDENCE_SUBMIT_MAX_PHOTOS - photos.length,
    });

    if (!result.canceled && result.assets?.length) {
      const uris = result.assets.map((asset) => asset.uri);
      setPhotos((prev) =>
        [...new Set([...prev, ...uris])].slice(0, EVIDENCE_SUBMIT_MAX_PHOTOS),
      );
    }
  };

  const takePhoto = async () => {
    if (!ensureCanAddPhoto()) return;

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
        [...new Set([...prev, result.assets[0].uri])].slice(
          0,
          EVIDENCE_SUBMIT_MAX_PHOTOS,
        ),
      );
    }
  };

  const removePhoto = (uri) => {
    setPhotos((prev) => prev.filter((photo) => photo !== uri));
  };

  const resetForm = () => {
    setPhotos([]);
    setDescription('');
  };

  const handleSubmit = async () => {
    if (!isValid || submitting) return;

    if (
      !requireVerifiedEmail(null, {
        title: 'Confirme seu email',
        message: 'Confirme seu email para enviar evidências.',
      })
    ) {
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('description', description.trim());

      const compressed = await Promise.all(
        photos.map(async (uri, index) => {
          const converted = await compressEvidencePhoto(uri);
          return toEvidenceUploadFile(converted, index);
        }),
      );

      compressed.forEach((photo) => formData.append('photos', photo));

      await submitEvidence(complaintId, formData);

      resetForm();
      onSubmitted?.();
      onClose();
    } catch (error) {
      console.warn('Evidence submit failed', error?.message);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    description,
    isValid,
    photos,
    submitting,
    handleSubmit,
    pickFromGallery,
    removePhoto,
    setDescription,
    takePhoto,
  };
}
