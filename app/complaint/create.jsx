import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ComplaintBasicInfo from '../../components/complaints/ComplaintBasicInfo';
import ComplaintLocation from '../../components/complaints/ComplaintLocation';
import ComplaintTypeAnimal from '../../components/complaints/ComplaintTypeAnimal';
import PhotoSection from '../../components/complaints/PhotoSection';

import { useLocation } from '../../hooks/useLocation';
import { createComplaint, getComplaintById, updateComplaint } from '../../services/complaints.service';
import { ANIMAL_TYPES, COMPLAINT_TYPES } from '../../constants/complaints.constants';
import { validateComplaintForm } from '../../utils/complaintForm';

const COLORS = {
  background: '#F7F4F0',
  border: '#E8E4DF',
  orange: '#FF6B35',
};

// Estado inicial do formulário
const INITIAL_FORM = {
  title: '',
  description: '',
  type: '',
  animal: '',
  animalOther: '',
  locationMode: 'auto',
  photos: [],
};

const normalizeText = (value) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const normalizeComplaintResponse = (response) =>
  response?.data || response?.complaint || response;

const normalizeLocation = (location) => {
  const latitude = Number(location?.latitude);
  const longitude = Number(location?.longitude);

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return null;
  }

  return { latitude, longitude };
};

const normalizeComplaintType = (value) => {
  const normalized = normalizeText(value);
  if (!normalized) return '';

  const directMatch = COMPLAINT_TYPES.find(
    (item) =>
      normalizeText(item.value) === normalized ||
      normalizeText(item.label) === normalized
  );

  if (directMatch) return directMatch.value;

  if (normalized.includes('maus')) return 'maus-tratos fisicos';
  if (normalized.includes('neglig')) return 'negligencia';
  if (normalized.includes('aband')) return 'abandono';
  if (normalized.includes('perd')) return 'perdido';
  if (normalized.includes('outro')) return 'outro';

  return '';
};

const normalizeAnimalType = (value) => {
  const normalized = normalizeText(value);
  if (!normalized) return '';

  const directMatch = ANIMAL_TYPES.find(
    (item) =>
      normalizeText(item.value) === normalized ||
      normalizeText(item.label) === normalized
  );

  if (directMatch) return directMatch.value;

  if (normalized.includes('cach') || normalized.includes('cao')) return 'cachorro';
  if (normalized.includes('gat')) return 'gato';
  if (normalized.includes('pass')) return 'passaro';
  if (normalized.includes('outro')) return 'outro';

  return '';
};

export default function CreateComplaintScreen() {
  const router = useRouter();
  const { edit, id } = useLocalSearchParams();
  const complaintId = Array.isArray(id) ? id[0] : id;

  // Hook que captura localização automática
  const { location } = useLocation();

  const [form, setForm] = useState(INITIAL_FORM);

  // Localização escolhida manualmente no mapa
  const [manualLocation, setManualLocation] = useState(null);

  // Controle de loading no envio
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Controle de loading no carregamento para edição
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);

  const isEdit = edit === 'true' && complaintId;

  // Carrega dados para edição
  useEffect(() => {
    if (isEdit) {
      const loadComplaint = async () => {
        try {
          setIsLoadingEdit(true);
          const response = await getComplaintById(complaintId);
          const complaint = normalizeComplaintResponse(response);
          const normalizedLocation = normalizeLocation(complaint?.location);

          setForm({
            title: complaint?.title || '',
            description: complaint?.description || '',
            type: normalizeComplaintType(complaint?.type),
            animal: normalizeAnimalType(complaint?.animal),
            animalOther: '',
            locationMode: normalizedLocation ? 'map' : 'auto',
            photos: Array.isArray(complaint?.photos)
              ? complaint.photos.filter(Boolean)
              : [],
          });
          if (normalizedLocation) {
            setManualLocation(normalizedLocation);
          }
        } catch (error) {
          console.error('Erro ao carregar denúncia para edição:', error);
          Alert.alert('Erro', 'Não foi possível carregar os dados da denúncia.');
          router.back();
        } finally {
          setIsLoadingEdit(false);
        }
      };
      loadComplaint();
    }
  }, [complaintId, isEdit, router]);

  // Atualiza qualquer campo do formulário
  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Reseta o formulário após envio
  const resetForm = () => {
    setForm(INITIAL_FORM);
    setManualLocation(null);
  };

  // Quando entra no modo "map", define localização inicial no marcador
  useEffect(() => {
    if (form.locationMode === 'map' && location && !manualLocation) {
      setManualLocation(location);
    }
  }, [form.locationMode, location, manualLocation]);

  // Decide qual localização será enviada
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

  // Função principal de envio da denúncia
  const handleSubmit = async () => {
    // Validação do formulário
    const validationError = validateComplaintForm(form);

    if (validationError) {
      Alert.alert('Validação', validationError);
      return;
    }

    // Garante que localização automática foi obtida
    if (form.locationMode === 'auto' && !location) {
      Alert.alert(
        'Localização',
        'Não foi possível obter a localização atual.'
      );
      return;
    }

    // Garante que usuário escolheu ponto no mapa
    if (form.locationMode === 'map' && !manualLocation) {
      Alert.alert('Mapa', 'Selecione um ponto no mapa.');
      return;
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Monta payload final para API
      const basePayload = {
        title: form.title.trim(),
        description: form.description.trim(),
        type: form.type,
        animal: form.animal,
        location: resolveLocation(),
      };

      const payload = isEdit
        ? {
            ...basePayload,
            photos: form.photos,
          }
        : {
            ...basePayload,
            status: 'aberto',
            photos: form.photos,
          };

      console.log('Payload da denúncia:', payload);

      if (isEdit) {
        console.log('Calling updateComplaint with id:', complaintId);
        const result = await updateComplaint(complaintId, payload);

        if (result) {
          Alert.alert('Sucesso', 'Denúncia atualizada com sucesso!', [
            {
              text: 'OK',
              onPress: () => router.replace('/'),
            },
          ]);
        } else {
          Alert.alert('Erro', 'O servidor não confirmou a alteração.');
        }
      } else {
        console.log('Calling createComplaint');
        await createComplaint(payload);
        // Feedback + navegação
        Alert.alert('Sucesso', 'Denúncia criada com sucesso!', [
          {
            text: 'OK',
            onPress: () => {
              resetForm();
              router.back();
            },
          },
        ]);
      }
    } catch (error) {
      console.log('Erro ao salvar denúncia:', error);
      Alert.alert('Erro', 'Não foi possível salvar a denúncia.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Configuração do header */}
      <Stack.Screen
        options={{
          title: isEdit ? 'Editar Denúncia' : 'Nova Denúncia',
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={handleGoBack}
              hitSlop={12}
              style={styles.headerBackContainer}
            >
              <Ionicons name="chevron-back" size={20} color={COLORS.orange} />
              <Text style={styles.headerButton}>Voltar</Text>
            </Pressable>
          ),
        }}
      />

      <View style={styles.screen}>
        {isLoadingEdit ? (
          <View style={styles.loadingContainer}>
            <Text>Carregando dados...</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Dados básicos */}
            <ComplaintBasicInfo
              title={form.title}
              description={form.description}
              onChangeTitle={(value) => updateField('title', value)}
              onChangeDescription={(value) =>
                updateField('description', value)
              }
            />

            {/* Tipo e animal */}
            <ComplaintTypeAnimal
              type={form.type}
              animal={form.animal}
              animalOther={form.animalOther}
              onChangeType={(value) => updateField('type', value)}
              onChangeAnimal={(value) => updateField('animal', value)}
              onChangeAnimalOther={(value) =>
                updateField('animalOther', value)
              }
            />

            {/* Localização */}
            <ComplaintLocation
              locationMode={form.locationMode}
              location={location}
              manualLocation={manualLocation}
              onChangeLocationMode={(value) =>
                updateField('locationMode', value)
              }
              onChangeManualLocation={setManualLocation}
            />

            {/* Fotos */}
            <PhotoSection
              photos={form.photos}
              setPhotos={(value) => {
                if (typeof value === 'function') {
                  updateField('photos', value(form.photos));
                  return;
                }

                updateField('photos', value);
              }}
              maxPhotos={5}
            />
          </ScrollView>
        )}

        {/* Botão fixo inferior */}
        <View style={styles.footer}>
          <Pressable
            style={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting || isLoadingEdit}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Salvando...' : isEdit ? 'Salvar' : 'Publicar'}
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
    paddingBottom: 120,
    gap: 14,
  },
  headerButton: {
    color: COLORS.orange,
    fontSize: 16,
    fontWeight: '700',
  },
  headerBackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingRight: 8,
  },
  disabledText: {
    opacity: 0.7,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    left: -25,
    right: -25,
    bottom: 0,
    padding: 35,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    overflow: 'hidden', //  ESSENCIAL
  },
  submitButton: {
    backgroundColor: COLORS.orange,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
     marginTop: -25, // sobe o botão
    width: '100%', //  garante alinhamento correto
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
