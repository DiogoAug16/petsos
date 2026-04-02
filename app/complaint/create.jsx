import { Stack } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import PhotoSection from '../../components/complaints/PhotoSection';
import { ANIMAL_TYPES, COMPLAINT_TYPES } from '../../constants/complaintOptions';
import { createComplaint } from '../../services/complaints.service';
import {
    buildComplaintLocation,
    validateComplaintForm,
} from '../../utils/complaintForm';

const COLORS = {
  background: '#F7F4F0',
  card: '#FFFFFF',
  border: '#E8E4DF',
  text: '#1C1C1E',
  muted: '#8A8A8E',
  placeholder: '#C0BCB8',
  orange: '#FF6B35',
  green: '#1A936F',
  danger: '#E63946',
};

export default function CreateComplaintScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('abandono');
  const [animal, setAnimal] = useState('');
  const [animalOther, setAnimalOther] = useState('');
  const [locationMode, setLocationMode] = useState('auto');
  const [address, setAddress] = useState('');
  const [photos, setPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setType('abandono');
    setAnimal('');
    setAnimalOther('');
    setLocationMode('auto');
    setAddress('');
    setPhotos([]);
  };

  const handleSubmit = async () => {
    const validationError = validateComplaintForm({
      title,
      description,
      type,
      animal,
      animalOther,
      locationMode,
      address,
    });

    if (validationError) {
      Alert.alert('Validação', validationError);
      return;
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const payload = {
        title: title.trim(),
        description: description.trim(),
        type,
        animal: animal === 'outro' ? animalOther.trim() : animal,
        status: 'aberto',
        location: buildComplaintLocation(locationMode, address),
        photos,
      };

      console.log('Payload da denúncia:', payload);

      await createComplaint(payload);

      Alert.alert('Sucesso', 'Denúncia criada com sucesso!');
      resetForm();
    } catch (error) {
      console.log('Erro ao criar denúncia:', error);
      Alert.alert('Erro', 'Não foi possível criar a denúncia.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderChip = (item, selectedValue, onSelect, activeColor) => {
    const isActive = item.value === selectedValue;

    return (
      <Pressable
        key={item.value}
        onPress={() => onSelect(item.value)}
        style={[
          styles.chip,
          isActive && {
            backgroundColor: activeColor,
            borderColor: activeColor,
          },
        ]}
      >
        <Text style={[styles.chipText, isActive && { color: '#fff' }]}>
          {item.label}
        </Text>
      </Pressable>
    );
  };

  const renderLocationOption = (mode, icon, titleText, subtitle) => {
    const selected = locationMode === mode;

    return (
      <Pressable
        onPress={() => setLocationMode(mode)}
        style={[
          styles.locationOption,
          selected && styles.locationOptionSelected,
        ]}
      >
        <View
          style={[
            styles.locationIcon,
            selected && { backgroundColor: COLORS.green },
          ]}
        >
          <Text style={styles.locationIconText}>{icon}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.locationTitle,
              selected && { color: COLORS.green },
            ]}
          >
            {titleText}
          </Text>
          <Text style={styles.locationSubtitle}>{subtitle}</Text>
        </View>

        <View style={[styles.radio, selected && styles.radioSelected]}>
          {selected ? <View style={styles.radioInner} /> : null}
        </View>
      </Pressable>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Nova Denúncia',
          headerBackTitleVisible: false,
          headerRight: () => (
            <Pressable onPress={handleSubmit} disabled={isSubmitting}>
              <Text
                style={[
                  styles.headerButton,
                  isSubmitting && styles.headerButtonDisabled,
                ]}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar'}
              </Text>
            </Pressable>
          ),
        }}
      />

      <View style={styles.screen}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.label}>
              TÍTULO <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Ex: Cachorro abandonado e ferido"
              placeholderTextColor={COLORS.placeholder}
              style={styles.input}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>
              DESCRIÇÃO <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Descreva o caso com detalhes..."
              placeholderTextColor={COLORS.placeholder}
              multiline
              textAlignVertical="top"
              style={[styles.input, styles.textArea]}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>
              TIPO DE DENÚNCIA <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.chipsContainer}>
              {COMPLAINT_TYPES.map((item) =>
                renderChip(item, type, setType, COLORS.orange)
              )}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>
              TIPO DE ANIMAL <Text style={styles.required}>*</Text>
            </Text>

            <View style={styles.chipsContainer}>
              {ANIMAL_TYPES.map((item) =>
                renderChip(item, animal, setAnimal, COLORS.green)
              )}
            </View>

            {animal === 'outro' && (
              <TextInput
                value={animalOther}
                onChangeText={setAnimalOther}
                placeholder="Qual animal?"
                placeholderTextColor={COLORS.placeholder}
                style={[styles.input, styles.otherAnimalInput]}
              />
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>
              LOCALIZAÇÃO <Text style={styles.required}>*</Text>
            </Text>

            {renderLocationOption(
              'auto',
              '📍',
              'Usar localização atual',
              'Capturar automaticamente'
            )}

            {locationMode === 'text' && (
              <TextInput
                value={address}
                onChangeText={setAddress}
                placeholder="Ex: Rua das Flores, 142, Cuiabá"
                placeholderTextColor={COLORS.placeholder}
                style={[styles.input, styles.addressInput]}
              />
            )}

            {renderLocationOption(
              'map',
              '🗺️',
              'Marcar no mapa',
              'Apontar manualmente onde ocorreu'
            )}
          </View>

          <PhotoSection photos={photos} setPhotos={setPhotos} maxPhotos={5} />
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Enviando...' : 'Publicar'}
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
  headerButtonDisabled: {
    opacity: 0.7,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.muted,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  required: {
    color: COLORS.danger,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    color: COLORS.text,
    fontSize: 14,
  },
  textArea: {
    minHeight: 100,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.muted,
  },
  otherAnimalInput: {
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: COLORS.green,
  },
  locationOption: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 12,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  locationOptionSelected: {
    borderWidth: 1.5,
    borderColor: COLORS.green,
    backgroundColor: 'rgba(26,147,111,0.06)',
  },
  locationIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationIconText: {
    fontSize: 16,
  },
  locationTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  locationSubtitle: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 2,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    backgroundColor: COLORS.green,
    borderColor: COLORS.green,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  addressInput: {
    marginTop: 8,
    marginBottom: 8,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  submitButton: {
    backgroundColor: COLORS.orange,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
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