import { StyleSheet } from 'react-native';

export const FORM_COLORS = {
  background: '#E8F4F8',
  card: '#FFFFFF',
  border: '#F0F0F0',
  text: '#1C1C1E',
  muted: '#8A8A8E',
  placeholder: '#A8C4CE',
  danger: '#E63946',
  green: '#1A936F',
  orange: '#FF6B35',
};

export const formStyles = StyleSheet.create({
  card: {
    backgroundColor: FORM_COLORS.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: FORM_COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 6,
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
