import { StyleSheet } from 'react-native';

const ORANGE = '#FF9F1C';

export const statesStyles = () => {
  return StyleSheet.create({
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      padding: 32,
    },

    emptyStateContent: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      padding: 32,
      marginHorizontal: 16,
      marginTop: 24,
      backgroundColor: '#FFFFFF',
      borderRadius: 24,
      borderWidth: 1,
      borderColor: '#F0D8BF',
    },

    loadingText: {
      fontSize: 13,
      color: '#8D7D78',
    },

    errorIcon: {
      fontSize: 40,
    },

    errorTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: '#272A3A',
    },

    errorMessage: {
      fontSize: 13,
      color: '#8D7D78',
      textAlign: 'center',
    },

    retryButton: {
      paddingHorizontal: 24,
      paddingVertical: 10,
      backgroundColor: ORANGE,
      borderRadius: 16,
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },

    retryButtonText: {
      fontSize: 13,
      fontWeight: '600',
      color: '#fff',
    },

    emptyIcon: {
      fontSize: 48,
    },

    emptyTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: '#272A3A',
    },

    emptySubtitle: {
      fontSize: 13,
      color: '#8D7D78',
      textAlign: 'center',
    },
  });
};
