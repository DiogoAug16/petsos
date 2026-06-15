import { StyleSheet } from 'react-native';

const ORANGE = '#FF9F1C';

export const filterChipsStyles = (colorScheme) => {
  const isDark = colorScheme === 'dark';

  return StyleSheet.create({
    scrollWrapper: {
      flexGrow: 0,
      flexShrink: 0,
      backgroundColor: isDark ? '#FFFCF7' : '#FFFFFF',
      borderBottomWidth: 0.5,
      borderBottomColor: isDark ? '#F0D8BF' : '#F0D8BF',
    },

    chipsContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
      paddingHorizontal: 20,
      paddingVertical: 14,
    },

    chip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: isDark ? '#F0D8BF' : '#FFF6EC',
        borderWidth: 1,
        borderColor: isDark ? '#E7C7A8' : '#F0D8BF',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        minHeight: 28,
    },

    chipActive: {
      backgroundColor: ORANGE,
      borderColor: ORANGE,
    },

    chipText: {
        fontSize: 12,
        fontWeight: '600',
        color: isDark ? '#FFFFFF' : '#272A3A',
        includeFontPadding: false,
        height: 16,         
        lineHeight: 16,
    },

    chipTextActive: {
      color: '#fff',
    },
  });
};