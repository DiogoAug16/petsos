import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ANIMAL_TYPES, COMPLAINT_TYPES } from '@/constants/complaints.constants';
import { FORM_COLORS, formStyles } from '@/constants/FormStyles';

export default function ComplaintTypeAnimal({
  type,
  animal,
//  animalOther,
  onChangeType,
  onChangeAnimal,
  //onChangeAnimalOther,
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
      <View style={formStyles.card}>
        <Text style={formStyles.label}>
          TIPO DE DENÚNCIA <Text style={formStyles.required}>*</Text>
        </Text>
        <View style={styles.chipsContainer}>
          {COMPLAINT_TYPES.map((item) =>
            renderChip(item, type, onChangeType, FORM_COLORS.orange)
          )}
        </View>
      </View>

      <View style={formStyles.card}>
        <Text style={formStyles.label}>
          TIPO DE ANIMAL <Text style={formStyles.required}>*</Text>
        </Text>

        <View style={styles.chipsContainer}>
          {ANIMAL_TYPES.map((item) =>
            renderChip(item, animal, onChangeAnimal, FORM_COLORS.green)
          )}
        </View>

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: FORM_COLORS.background,
    borderWidth: 0.5,
    borderColor: FORM_COLORS.border,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: FORM_COLORS.muted,
  },
  chipTextActive: {
    color: '#fff',
  },

});