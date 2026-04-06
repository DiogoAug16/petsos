import { StyleSheet } from 'react-native';

const ORANGE = '#FF6B35';

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
      color: '#8A8A8E',
    },

    errorIcon: {
      fontSize: 40,
    },

    errorTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#fff' : '#1C1C1E',
    },

    errorMessage: {
      fontSize: 13,
      color: '#8A8A8E',
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
      color: isDark ? '#fff' : '#1C1C1E',
    },

    emptySubtitle: {
      fontSize: 13,
      color: '#8A8A8E',
      textAlign: 'center',
    },
  });
};
