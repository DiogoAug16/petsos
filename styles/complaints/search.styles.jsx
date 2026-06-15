import { StyleSheet } from 'react-native';

export const searchStyles = (colorScheme) => {
  const isDark = colorScheme === 'dark';

  return StyleSheet.create({
    searchContainer: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: isDark ? '#242B3D' : '#FFFFFF',
    },

    searchBar: {
      backgroundColor: isDark ? '#2F3749' : '#E8F4F8',
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      borderWidth: 0.5,
      borderColor: isDark ? '#2F3749' : '#F0F0F0',
    },

    searchInput: {
      flex: 1,
      fontSize: 14,
      color: isDark ? '#fff' : '#1C1C1E',
    },

    filterBtn: {
      width: 30,
      height: 30,
      backgroundColor: '#FF6B35',
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};
