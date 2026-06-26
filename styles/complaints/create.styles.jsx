import { StyleSheet } from 'react-native';

export const createComplaintColors = {
  background: '#FFF6EC',
  border: '#F0D8BF',
  orange: '#FF9F1C',
};

export const createComplaintStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: createComplaintColors.background,
  },
  container: {
    flex: 1,
    backgroundColor: createComplaintColors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 120,
    gap: 14,
  },
  headerButton: {
    color: createComplaintColors.orange,
    fontSize: 16,
    fontWeight: '700',
  },
  headerBackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingRight: 8,
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
    backgroundColor: createComplaintColors.background,
    borderTopWidth: 1,
    borderTopColor: createComplaintColors.border,
    overflow: 'hidden',
  },
  submitButton: {
    backgroundColor: createComplaintColors.orange,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -25,
    width: '100%',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  authRequiredScreen: {
    flex: 1,
    backgroundColor: createComplaintColors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  authRequiredTitle: {
    color: '#272A3A',
    fontSize: 24,
    fontWeight: '900',
  },
  authRequiredText: {
    color: '#8D7D78',
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 18,
  },
  authRequiredButton: {
    minHeight: 46,
    paddingHorizontal: 18,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: createComplaintColors.orange,
  },
  authRequiredButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
  },
});
