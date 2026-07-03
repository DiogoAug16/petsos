import { StyleSheet } from 'react-native';

export const FORM_COLORS = {
  background: '#FFF6EC',
  card: '#FFFFFF',
  border: '#F0D8BF',
  text: '#272A3A',
  muted: '#8D7D78',
  placeholder: '#A8C4CE',
  danger: '#E63946',
  green: '#1A936F',
  orange: '#FF9F1C',
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
