import { StyleSheet, Text, TextInput, View } from 'react-native';
import { FORM_COLORS, formStyles } from '@/constants/FormStyles';

export default function ComplaintBasicInfo({
  title,
  description,
  onChangeTitle,
  onChangeDescription,
}) {
  return (
    <>
      <View style={formStyles.card}>
        <Text style={formStyles.label}>
          TÍTULO <Text style={formStyles.required}>*</Text>
        </Text>
        <TextInput
          value={title}
          onChangeText={onChangeTitle}
          placeholder="Ex: Cachorro abandonado e ferido"
          placeholderTextColor={FORM_COLORS.placeholder}
          style={styles.input}
        />
      </View>

      <View style={formStyles.card}>
        <Text style={formStyles.label}>
          DESCRIÇÃO <Text style={formStyles.required}>*</Text>
        </Text>
        <TextInput
          value={description}
          onChangeText={onChangeDescription}
          placeholder="Descreva o caso com detalhes..."
          placeholderTextColor={FORM_COLORS.placeholder}
          multiline
          textAlignVertical="top"
          style={[styles.input, styles.textArea]}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: FORM_COLORS.background,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 0.5,
    borderColor: FORM_COLORS.border,
    color: FORM_COLORS.text,
    fontSize: 14,
  },
  textArea: {
    minHeight: 100,
  },
});