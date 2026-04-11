import { StyleSheet } from 'react-native';

export const sortButtonStyles = StyleSheet.create({
  sortBtnWrapper: {
    width: 30,
    height: 30,
    flexShrink: 0,
  },
  sortBtn: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortLabelContainer: {
    position: 'absolute',
    left: 8,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  sortLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  sortIconContainer: {
    position: 'absolute',
    right: 6,
    top: 0,
    bottom: 0,
    width: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
