import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    top: -3,
    marginRight: 16,
    padding: 6,
    marginTop: 10,
  },

  badge: {
    position: 'absolute',
    top: 0,
    right: 2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },

  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});