import { StyleSheet } from 'react-native';

export const searchStyles = () => {
  return StyleSheet.create({
    searchContainer: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 6,
    },

    searchBar: {
      minHeight: 48,
      backgroundColor: '#FFFFFF',
      borderRadius: 18,
      paddingHorizontal: 14,
      paddingVertical: 6,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      borderWidth: 1,
      borderColor: '#F0D8BF',
      shadowColor: '#7A3F12',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.04,
      shadowRadius: 10,
      elevation: 1,
    },

    searchInput: {
      flex: 1,
      fontSize: 14,
      color: '#272A3A',
      minHeight: 36,
    },

    filterBtn: {
      width: 44,
      height: 44,
      backgroundColor: '#FF9F1C',
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};
