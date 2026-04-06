import { StyleSheet } from 'react-native';

export const searchStyles = (colorScheme) => {
  const isDark = colorScheme === 'dark';

  return StyleSheet.create({
    searchContainer: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: isDark ? '#1C1C1E' : '#fff',
    },

    searchBar: {
      backgroundColor: isDark ? '#2C2C2E' : '#F7F4F0',
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      borderWidth: 0.5,
      borderColor: isDark ? '#3A3A3A' : '#E8E4DF',
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
