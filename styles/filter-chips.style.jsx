import { StyleSheet } from 'react-native';

const ORANGE = '#FF6B35';

export const filterChipsStyles = (colorScheme) => {
  const isDark = colorScheme === 'dark';

  return StyleSheet.create({
    scrollWrapper: {
      flexGrow: 0,
      flexShrink: 0,
      backgroundColor: isDark ? '#1C1C1E' : '#fff',
      borderBottomWidth: 0.5,
      borderBottomColor: isDark ? '#3A3A3A' : '#E8E4DF',
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
        backgroundColor: isDark ? '#3A3A3C' : '#F7F4F0',
        borderWidth: 1,
        borderColor: isDark ? '#636366' : '#E8E4DF',
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
        color: isDark ? '#FFFFFF' : '#1C1C1E',
        includeFontPadding: false,
        height: 16,         
        lineHeight: 16,
    },

    chipTextActive: {
      color: '#fff',
    },
  });
};