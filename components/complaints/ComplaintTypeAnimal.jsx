import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ANIMAL_TYPES, COMPLAINT_TYPES } from '../../constants/complaintOptions';

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

export default function ComplaintTypeAnimal({
  type,
  animal,
  animalOther,
  onChangeType,
  onChangeAnimal,
  onChangeAnimalOther,
}) {
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
        <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
          {item.label}
        </Text>
      </Pressable>
    );
  };

  return (
    <>
      <View style={styles.card}>
        <Text style={styles.label}>
          TIPO DE DENÚNCIA <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.chipsContainer}>
          {COMPLAINT_TYPES.map((item) =>
            renderChip(item, type, onChangeType, COLORS.orange)
          )}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          TIPO DE ANIMAL <Text style={styles.required}>*</Text>
        </Text>

        <View style={styles.chipsContainer}>
          {ANIMAL_TYPES.map((item) =>
            renderChip(item, animal, onChangeAnimal, COLORS.green)
          )}
        </View>

        {animal === 'outro' && (
          <TextInput
            value={animalOther}
            onChangeText={onChangeAnimalOther}
            placeholder="Qual animal?"
            placeholderTextColor={COLORS.placeholder}
            style={[styles.input, styles.otherAnimalInput]}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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
  chipTextActive: {
    color: '#fff',
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
  otherAnimalInput: {
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: COLORS.green,
  },
});