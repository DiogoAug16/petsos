import { StyleSheet } from 'react-native';

export const evidenceSubmitStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0D8BF',
  },
  headerSpacer: {
    width: 24,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#272A3A',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8D7D78',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  labelWithSpacing: {
    marginTop: 24,
  },
  hint: {
    fontSize: 12,
    color: '#8D7D78',
    marginBottom: 12,
  },
  photoActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF6EC',
    borderWidth: 0.5,
    borderColor: '#F0D8BF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  photoButtonText: {
    color: '#555',
    fontWeight: '600',
    fontSize: 13,
  },
  photosScroll: {
    marginBottom: 8,
  },
  photoWrapper: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 8,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#FFF6EC',
    borderWidth: 0.5,
    borderColor: '#F0D8BF',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: '#272A3A',
    minHeight: 120,
  },
  footer: {
    padding: 16,
    paddingBottom: 34,
    borderTopWidth: 0.5,
    borderTopColor: '#F0D8BF',
  },
  submitButton: {
    backgroundColor: '#FF9F1C',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
