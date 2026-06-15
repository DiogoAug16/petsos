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
      backgroundColor: isDark ? '#FFFCF7' : '#FFFFFF',
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
      color: isDark ? '#fff' : '#272A3A',
    },

    filterBtn: {
      width: 34,
      height: 34,
      backgroundColor: '#FF9F1C',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },

    filterBtnActive: {
      backgroundColor: isDark ? '#FFB457' : '#E88212',
    },

    filterPanel: {
      position: 'absolute',
      top: 155,
      left: 16,
      right: 16,
      zIndex: 12,
      borderRadius: 14,
      backgroundColor: isDark ? '#FFFCF7' : '#FFFFFF',
      paddingHorizontal: 14,
      paddingVertical: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 10,
      elevation: 8,
      gap: 10,
    },

    filterTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: isDark ? '#F2F2F7' : '#272A3A',
    },

    filterLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: isDark ? '#8D7D78' : '#6F6772',
    },

    filterStatusList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },

    filterStatusOption: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: isDark ? '#F0D8BF' : '#F0D8BF',
      backgroundColor: isDark ? '#F0D8BF' : '#FFF6EC',
    },

    filterStatusOptionActive: {
      borderColor: '#FF9F1C',
      backgroundColor: '#FF9F1C',
    },

    filterStatusOptionText: {
      fontSize: 12,
      fontWeight: '600',
      color: isDark ? '#F2F2F7' : '#272A3A',
    },

    filterStatusOptionTextActive: {
      color: '#fff',
    },

    filterActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 8,
      marginTop: 4,
    },

    filterClearButton: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 10,
      backgroundColor: isDark ? '#F0D8BF' : '#FFE8C8',
    },

    filterClearButtonText: {
      fontSize: 12,
      fontWeight: '600',
      color: isDark ? '#F2F2F7' : '#4A4050',
    },

    filterApplyButton: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 10,
      backgroundColor: '#FF9F1C',
    },

    filterApplyButtonText: {
      fontSize: 12,
      fontWeight: '700',
      color: '#fff',
    },

    autocompleteContainer: {
      position: 'absolute',
      top: 155,
      left: 16,
      right: 16,
      zIndex: 11,
      borderRadius: 14,
      backgroundColor: isDark ? '#FFFCF7' : '#FFFFFF',
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
      borderBottomColor: isDark ? '#F0D8BF' : '#FFE8C8',
      gap: 2,
    },

    autocompleteItemLast: {
      borderBottomWidth: 0,
    },

    autocompleteTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#F2F2F7' : '#272A3A',
    },

    autocompleteSubtitle: {
      fontSize: 12,
      color: isDark ? '#8D7D78' : '#6F6772',
    },

    noResultsBadge: {
      position: 'absolute',
      top: 155,
      left: 16,
      right: 16,
      zIndex: 11,
      borderRadius: 12,
      backgroundColor: isDark ? '#F0D8BF' : '#FFFFFF',
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: isDark ? '#F0D8BF' : '#F0D8BF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 6,
    },

    noResultsText: {
      fontSize: 12,
      fontWeight: '600',
      color: isDark ? '#F2F2F7' : '#4A4050',
      textAlign: 'center',
    },
  });
};
