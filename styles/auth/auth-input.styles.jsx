import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  fieldContainer: {
    gap: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  inputWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  input: {
    flex: 1,
    borderRadius: 14,
    paddingLeft: 48,
    paddingRight: 16,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: 'transparent',
    fontSize: 15,
    fontWeight: '500',
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: -4,
  },
});
