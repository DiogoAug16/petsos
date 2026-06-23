import { StyleSheet } from 'react-native';

const ORANGE = '#FF9F1C';

export const filterChipsStyles = () => {
  return StyleSheet.create({
    scrollWrapper: {
      flexGrow: 0,
      flexShrink: 0,
    },

    chipsContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 0,
    },

    chip: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 999,
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#F0D8BF',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      minHeight: 40,
    },

    chipActive: {
      backgroundColor: ORANGE,
      borderColor: ORANGE,
    },

    chipText: {
      fontSize: 12,
      fontWeight: '800',
      color: '#272A3A',
      includeFontPadding: false,
      lineHeight: 16,
    },

    chipTextActive: {
      color: '#fff',
    },
  });
};
