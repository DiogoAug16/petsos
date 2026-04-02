import { StyleSheet, Text, TextInput, View } from 'react-native';

const COLORS = {
  background: '#F7F4F0',
  card: '#FFFFFF',
  border: '#E8E4DF',
  text: '#1C1C1E',
  muted: '#8A8A8E',
  placeholder: '#C0BCB8',
  danger: '#E63946',
};

export default function ComplaintBasicInfo({
  title,
  description,
  onChangeTitle,
  onChangeDescription,
}) {
  return (
    <>
      <View style={styles.card}>
        <Text style={styles.label}>
          TÍTULO <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          value={title}
          onChangeText={onChangeTitle}
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
          onChangeText={onChangeDescription}
          placeholder="Descreva o caso com detalhes..."
          placeholderTextColor={COLORS.placeholder}
          multiline
          textAlignVertical="top"
          style={[styles.input, styles.textArea]}
        />
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
});