import { StyleSheet } from 'react-native';

export const complaintMarkerStyles = StyleSheet.create({
  markerShell: {
    width: 54,
    height: 62,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  halo: {
    position: 'absolute',
    top: 5,
    width: 46,
    height: 46,
    borderRadius: 23,
    opacity: 0.42,
  },

  pin: {
    width: 44,
    height: 44,
    borderRadius: 18,
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  face: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  markerEmoji: {
    fontSize: 18,
    lineHeight: 22,
  },

  cheeks: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  cheek: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFB7C5',
    opacity: 0.82,
  },

  statusDot: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  pointer: {
    width: 14,
    height: 14,
    marginTop: -6,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderBottomRightRadius: 4,
    transform: [{ rotate: '45deg' }],
  },
});
