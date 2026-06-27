import { StyleSheet } from 'react-native';

export const tileHintMarkerStyles = StyleSheet.create({
  shell: {
    minWidth: 38,
    height: 38,
    borderRadius: 19,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FF9F1C',
    shadowColor: '#5E3A12',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  softRing: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFE8C8',
    opacity: 0.42,
  },
  count: {
    color: '#272A3A',
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '800',
  },
});
