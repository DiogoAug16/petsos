import { StyleSheet } from 'react-native';

const ORANGE = '#FF6B35';

export const filterChipsStyles = (colorScheme) => {
  const isDark = colorScheme === 'dark';

  return StyleSheet.create({
    scrollWrapper: {
      flexGrow: 0,
      flexShrink: 0,
      backgroundColor: isDark ? '#242B3D' : '#FFFFFF',
      borderBottomWidth: 0.5,
      borderBottomColor: isDark ? '#2F3749' : '#F0F0F0',
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
        backgroundColor: isDark ? '#2F3749' : '#E8F4F8',
        borderWidth: 1,
        borderColor: isDark ? '#3D4A5E' : '#F0F0F0',
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