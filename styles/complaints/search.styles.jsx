import { StyleSheet } from 'react-native';

export const searchStyles = (colorScheme) => {
  const isDark = colorScheme === 'dark';

  return StyleSheet.create({
    searchContainer: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: isDark ? '#FFFCF7' : '#FFFFFF',
    },

    searchBar: {
      backgroundColor: isDark ? '#F0D8BF' : '#FFF6EC',
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      borderWidth: 0.5,
      borderColor: isDark ? '#F0D8BF' : '#F0D8BF',
    },

    searchInput: {
      flex: 1,
      fontSize: 14,
      color: isDark ? '#fff' : '#272A3A',
    },

    filterBtn: {
      width: 30,
      height: 30,
      backgroundColor: '#FF9F1C',
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};
