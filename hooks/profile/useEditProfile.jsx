import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';

import { useHapticPress } from '@/hooks/ui/useHapticPress';
import { updateCurrentUserProfile } from '@/services/users/users.service';
import { buildUploadPhotoUri } from '@/utils/media/photo.utils';

const isImageAsset = (asset) => {
  if (!asset) return false;
  if (asset.type && asset.type !== 'image') return false;
  if (asset.mimeType && !asset.mimeType.startsWith('image/')) return false;
  return Boolean(asset.uri);
};

const isValidLocationLabel = (value) => {
  const trimmed = value.trim();
  if (!trimmed) return true;

  const parts = trimmed.split(',');
  if (parts.length !== 2) return false;

  const city = parts[0].trim();
  const state = parts[1].trim();
  return city.length >= 2 && /^[A-Z]{2}$/.test(state);
};

const normalizeLocationLabel = (value) => {
  const trimmed = value.trim();
  if (!trimmed || !trimmed.includes(',')) return trimmed;

  const [city, ...stateParts] = trimmed.split(',');
  const state = stateParts.join(',').trim().toUpperCase();
  return `${city.trim()}, ${state}`;
};

export function useEditProfile({ profile, uploadUrl }) {
  const router = useRouter();
  const [name, setName] = useState(profile?.name || '');
  const [locationLabel, setLocationLabel] = useState(profile?.locationLabel || '');
  const [description, setDescription] = useState(profile?.description || '');
  const [selectedPhotoUri, setSelectedPhotoUri] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setName(profile?.name || '');
    setLocationLabel(profile?.locationLabel || '');
    setDescription(profile?.description || '');
    setSelectedPhotoUri(null);
  }, [profile?.description, profile?.locationLabel, profile?.name, profile?.photoUrl]);

  const currentPhotoUri = useMemo(
    () => buildUploadPhotoUri(profile?.photoUrl, uploadUrl),
    [profile?.photoUrl, uploadUrl]
  );

  const previewPhotoUri = selectedPhotoUri || currentPhotoUri;

  const pickPhoto = useCallback(async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permissão negada',
          'Permita acesso à galeria para alterar sua foto de perfil.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
        selectionLimit: 1,
      });

      if (result.canceled) return;

      const asset = result.assets?.[0];
      if (!isImageAsset(asset)) {
        Alert.alert('Imagem inválida', 'Escolha um arquivo de imagem válido.');
        return;
      }

      setSelectedPhotoUri(asset.uri);
    } catch {
      Alert.alert('Erro', 'Não foi possível abrir a galeria.');
    }
  }, []);

  const goBack = useCallback(() => {
    if (typeof router.canGoBack === 'function' && router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(tabs)/profile');
  }, [router]);

  const cancel = useCallback(() => {
    Alert.alert(
      'Cancelar edição?',
      'As alterações feitas nesta tela não serão salvas.',
      [
        { text: 'Continuar editando', style: 'cancel' },
        {
          text: 'Descartar',
          style: 'destructive',
          onPress: goBack,
        },
      ]
    );
  }, [goBack]);

  const validatePayload = useCallback(() => {
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      Alert.alert('Nome inválido', 'Informe um nome com pelo menos 2 caracteres.');
      return null;
    }

    const trimmedLocation = normalizeLocationLabel(locationLabel);
    const trimmedDescription = description.trim();

    if (trimmedLocation.length > 80) {
      Alert.alert('Localização inválida', 'Use no máximo 80 caracteres.');
      return null;
    }

    if (!isValidLocationLabel(trimmedLocation)) {
      Alert.alert(
        'Localização inválida',
        'Use o formato cidade e UF, por exemplo Cuiabá, MT.'
      );
      return null;
    }

    if (trimmedDescription.length > 240) {
      Alert.alert('Descrição inválida', 'Use no máximo 240 caracteres.');
      return null;
    }

    return {
      name: trimmedName,
      locationLabel: trimmedLocation,
      description: trimmedDescription,
      photoUri: selectedPhotoUri,
    };
  }, [description, locationLabel, name, selectedPhotoUri]);

  const persistProfile = useCallback(
    async (payload) => {
      try {
        setIsSaving(true);
        await updateCurrentUserProfile(payload);

        goBack();
      } catch (error) {
        console.warn('Profile update failed', error?.message);
      } finally {
        setIsSaving(false);
      }
    },
    [goBack]
  );

  const save = useCallback(async () => {
    if (isSaving) return;
    const payload = validatePayload();
    if (!payload) return;

    Alert.alert('Salvar alterações?', 'Seu perfil será atualizado com estes dados.', [
      { text: 'Revisar', style: 'cancel' },
      {
        text: 'Salvar',
        onPress: () => persistProfile(payload),
      },
    ]);
  }, [isSaving, persistProfile, validatePayload]);

  return {
    name,
    setName,
    locationLabel,
    setLocationLabel,
    description,
    setDescription,
    previewPhotoUri,
    isSaving,
    pickPhoto: useHapticPress(pickPhoto, 'soft'),
    cancel: useHapticPress(cancel, 'soft'),
    save: useHapticPress(save, 'normal'),
  };
}
