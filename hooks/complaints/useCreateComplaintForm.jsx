import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import {
  ANIMAL_TYPES,
  COMPLAINT_TYPES,
  INITIAL_COMPLAINT_FORM,
} from '@/constants/complaints/complaints.constants';
import { useHapticPress } from '@/hooks/ui/useHapticPress';
import { useLocation } from '@/hooks/map/useLocation';
import {
  createComplaint,
  getComplaintById,
  updateComplaint,
} from '@/services/complaints/complaints.service';
import {
  normalizeAnimalType,
  normalizeComplaintResponse,
  normalizeComplaintType,
  normalizeLocation,
  validateComplaintForm,
} from '@/utils/complaints/complaintForm';

const AUTH_PROMPT = {
  title: 'Entre para criar uma denúncia',
  message: 'Faça login ou crie uma conta para registrar uma denúncia.',
};

export function useCreateComplaintForm({
  complaintId,
  isAuthenticated,
  isEdit,
  authLoading,
  openAuthPrompt,
  router,
}) {
  const { location } = useLocation();
  const [form, setForm] = useState(INITIAL_COMPLAINT_FORM);
  const [manualLocation, setManualLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      openAuthPrompt(AUTH_PROMPT);
    }
  }, [authLoading, isAuthenticated, openAuthPrompt]);

  useEffect(() => {
    if (!isAuthenticated || !isEdit) return;

    const loadComplaint = async () => {
      try {
        setIsLoadingEdit(true);
        const response = await getComplaintById(complaintId);
        const complaint = normalizeComplaintResponse(response);
        const normalizedLocation = normalizeLocation(complaint?.location);
        const loadedPhotos = Array.isArray(complaint?.photos)
          ? complaint.photos.filter(Boolean)
          : [];

        setForm({
          title: complaint?.title || '',
          description: complaint?.description || '',
          type: normalizeComplaintType(complaint?.type, COMPLAINT_TYPES),
          animal: normalizeAnimalType(complaint?.animal, ANIMAL_TYPES),
          animalOther: '',
          locationMode: normalizedLocation ? 'map' : 'auto',
          photos: loadedPhotos,
        });

        if (normalizedLocation) {
          setManualLocation(normalizedLocation);
        }
      } catch {
        Alert.alert('Erro', 'Não foi possível carregar os dados da denúncia.');
        router.back();
      } finally {
        setIsLoadingEdit(false);
      }
    };

    loadComplaint();
  }, [complaintId, isAuthenticated, isEdit, router]);

  useEffect(() => {
    if (form.locationMode === 'map' && location && !manualLocation) {
      setManualLocation(location);
    }
  }, [form.locationMode, location, manualLocation]);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(INITIAL_COMPLAINT_FORM);
    setManualLocation(null);
  };

  const resolveLocation = () => {
    if (form.locationMode === 'auto') {
      return location || null;
    }

    if (form.locationMode === 'map') {
      return manualLocation || null;
    }

    return null;
  };

  const handleGoBack = () => {
    if (typeof router.canGoBack === 'function' && router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/');
  };

  const handleAuthRequiredPress = () => {
    openAuthPrompt(AUTH_PROMPT);
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      openAuthPrompt(AUTH_PROMPT);
      return;
    }

    const validationError = validateComplaintForm(form);

    if (validationError) {
      Alert.alert('Validação', validationError);
      return;
    }

    if (form.locationMode === 'auto' && !location) {
      Alert.alert('Localização', 'Não foi possível obter a localização atual.');
      return;
    }

    if (form.locationMode === 'map' && !manualLocation) {
      Alert.alert('Mapa', 'Selecione um ponto no mapa.');
      return;
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const basePayload = {
        title: form.title.trim(),
        description: form.description.trim(),
        type: form.type,
        animal: form.animal,
        location: resolveLocation(),
      };
      const payload = isEdit
        ? { ...basePayload, photos: form.photos }
        : { ...basePayload, status: 'aberto', photos: form.photos };

      if (isEdit) {
        const result = await updateComplaint(complaintId, payload);

        if (result) {
          Alert.alert('Sucesso', 'Denúncia atualizada com sucesso!', [
            { text: 'OK', onPress: () => router.back() },
          ]);
        } else {
          Alert.alert('Erro', 'O servidor não confirmou a alteração.');
        }
        return;
      }

      await createComplaint(payload);
      Alert.alert('Sucesso', 'Denúncia criada com sucesso!', [
        {
          text: 'OK',
          onPress: () => {
            resetForm();
            router.back();
          },
        },
      ]);
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar a denúncia.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHapticAuthRequiredPress = useHapticPress(handleAuthRequiredPress);
  const handleHapticGoBack = useHapticPress(handleGoBack);
  const handleHapticSubmit = useHapticPress(handleSubmit, 'normal');

  return {
    form,
    location,
    manualLocation,
    isSubmitting,
    isLoadingEdit,
    handleAuthRequiredPress: handleHapticAuthRequiredPress,
    handleGoBack: handleHapticGoBack,
    handleSubmit: handleHapticSubmit,
    setManualLocation,
    updateField,
  };
}
