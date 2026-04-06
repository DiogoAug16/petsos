import { StyleSheet } from 'react-native';

export const searchStyles = (colorScheme) => {
  const isDark = colorScheme === 'dark';

  return StyleSheet.create({
    searchContainer: {
      position: 'absolute',
      top: 100,
      left: 16,
      right: 16,
      zIndex: 10,
    },

    searchBar: {
      backgroundColor: isDark ? '#1C1C1E' : '#fff',
      borderRadius: 16,
      paddingHorizontal: 14,
      paddingVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 6,
    },

    searchInput: {
      flex: 1,
      fontSize: 14,
      color: isDark ? '#fff' : '#1C1C1E',
    },

    filterBtn: {
      width: 34,
      height: 34,
      backgroundColor: '#FF6B35',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};
