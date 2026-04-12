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

    autocompleteContainer: {
      position: 'absolute',
      top: 155,
      left: 16,
      right: 16,
      zIndex: 11,
      borderRadius: 14,
      backgroundColor: isDark ? '#1C1C1E' : '#fff',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 10,
      elevation: 8,
      overflow: 'hidden',
    },

    autocompleteItem: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#2C2C2E' : '#F0F0F0',
      gap: 2,
    },

    autocompleteItemLast: {
      borderBottomWidth: 0,
    },

    autocompleteTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#F2F2F7' : '#1C1C1E',
    },

    autocompleteSubtitle: {
      fontSize: 12,
      color: isDark ? '#8A8A8E' : '#666666',
    },
  });
};
