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

    filterBtnActive: {
      backgroundColor: isDark ? '#FF8A5E' : '#E85A24',
    },

    filterPanel: {
      position: 'absolute',
      top: 155,
      left: 16,
      right: 16,
      zIndex: 12,
      borderRadius: 14,
      backgroundColor: isDark ? '#1C1C1E' : '#fff',
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
      color: isDark ? '#F2F2F7' : '#1C1C1E',
    },

    filterLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: isDark ? '#8A8A8E' : '#666666',
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
      borderColor: isDark ? '#3A3A3C' : '#E8E4DF',
      backgroundColor: isDark ? '#2C2C2E' : '#F7F4F0',
    },

    filterStatusOptionActive: {
      borderColor: '#FF6B35',
      backgroundColor: '#FF6B35',
    },

    filterStatusOptionText: {
      fontSize: 12,
      fontWeight: '600',
      color: isDark ? '#F2F2F7' : '#1C1C1E',
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
      backgroundColor: isDark ? '#2C2C2E' : '#F1F1F1',
    },

    filterClearButtonText: {
      fontSize: 12,
      fontWeight: '600',
      color: isDark ? '#F2F2F7' : '#333333',
    },

    filterApplyButton: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 10,
      backgroundColor: '#FF6B35',
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

    noResultsBadge: {
      position: 'absolute',
      top: 155,
      left: 16,
      right: 16,
      zIndex: 11,
      borderRadius: 12,
      backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF',
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: isDark ? '#3A3A3C' : '#E8E4DF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 6,
    },

    noResultsText: {
      fontSize: 12,
      fontWeight: '600',
      color: isDark ? '#F2F2F7' : '#333333',
      textAlign: 'center',
    },
  });
};
