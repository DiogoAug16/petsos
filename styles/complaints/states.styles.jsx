import { StyleSheet } from 'react-native';

const ORANGE = '#FF9F1C';

export const statesStyles = (colorScheme) => {
  const isDark = colorScheme === 'dark';

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
    },

    loadingText: {
      fontSize: 13,
      color: '#8D7D78',
    },

    errorIcon: {
      fontSize: 40,
    },

    errorTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#fff' : '#272A3A',
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
      borderRadius: 12,
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
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#fff' : '#272A3A',
    },

    emptySubtitle: {
      fontSize: 13,
      color: '#8D7D78',
      textAlign: 'center',
    },
  });
};
