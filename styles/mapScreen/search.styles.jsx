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

    markerPreview: {
      position: 'absolute',
      left: 16,
      right: 16,
      bottom: 122,
      zIndex: 14,
      borderRadius: 24,
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#F0D8BF',
      padding: 14,
      shadowColor: '#7A3F12',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.12,
      shadowRadius: 18,
      elevation: 10,
      gap: 12,
    },

    markerPreviewClose: {
      position: 'absolute',
      top: 10,
      right: 10,
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFF6EC',
      zIndex: 2,
    },

    markerPreviewCloseText: {
      color: '#8D7D78',
      fontSize: 18,
      lineHeight: 20,
      fontWeight: '900',
    },

    markerPreviewTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingRight: 32,
    },

    markerPreviewPhoto: {
      width: 58,
      height: 58,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },

    markerPreviewImage: {
      width: '100%',
      height: '100%',
    },

    markerPreviewEmoji: {
      fontSize: 26,
    },

    markerPreviewCopy: {
      flex: 1,
      minWidth: 0,
    },

    markerPreviewType: {
      color: '#FF8C42',
      fontSize: 12,
      fontWeight: '900',
      marginBottom: 3,
    },

    markerPreviewTitle: {
      color: '#272A3A',
      fontSize: 18,
      lineHeight: 23,
      fontWeight: '900',
    },

    markerPreviewActions: {
      flexDirection: 'row',
      gap: 10,
    },

    markerPreviewSecondaryButton: {
      flex: 1,
      minHeight: 48,
      borderRadius: 16,
      backgroundColor: '#FFF6EC',
      borderWidth: 1,
      borderColor: '#F0D8BF',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 8,
    },

    markerPreviewSecondaryText: {
      color: '#272A3A',
      fontSize: 14,
      fontWeight: '900',
    },

    markerPreviewPrimaryButton: {
      flex: 1,
      minHeight: 48,
      borderRadius: 16,
      backgroundColor: '#FF9F1C',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 8,
    },

    markerPreviewPrimaryText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '900',
    },
  });
};
