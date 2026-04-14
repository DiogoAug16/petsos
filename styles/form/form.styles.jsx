import { StyleSheet } from 'react-native';

export const FORM_COLORS = {
  background: '#F7F4F0',
  card: '#FFFFFF',
  border: '#E8E4DF',
  text: '#1C1C1E',
  muted: '#8A8A8E',
  placeholder: '#C0BCB8',
  danger: '#E63946',
  green: '#1A936F',
  orange: '#FF6B35',
};

export const formStyles = StyleSheet.create({
  card: {
    backgroundColor: FORM_COLORS.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 0.5,
    borderColor: FORM_COLORS.border,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: FORM_COLORS.muted,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  required: {
    color: FORM_COLORS.danger,
  },
});
