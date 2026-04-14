import { StyleSheet } from 'react-native';

const ORANGE = '#FF6B35';

export const cardStyles = (colorScheme) => {
  const isDark = colorScheme === 'dark';

  return StyleSheet.create({
    card: {
      backgroundColor: isDark ? '#1C1C1E' : '#fff',
      borderRadius: 16,
      padding: 14,
      borderWidth: 0.5,
      borderColor: isDark ? '#3A3A3A' : '#E8E4DF',
    },

    cardPressed: {
      borderColor: ORANGE,
      borderWidth: 1.5,
    },

    cardTop: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'flex-start',
    },

    cardPhoto: {
      width: 56,
      height: 56,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },

    cardPhotoEmoji: {
      fontSize: 22,
    },

    cardBody: {
      flex: 1,
    },

    cardTitle: {
      fontSize: 13,
      fontWeight: '500',
      color: isDark ? '#fff' : '#1C1C1E',
      marginBottom: 3,
      lineHeight: 18,
    },

    cardAddress: {
      fontSize: 11,
      color: '#8A8A8E',
      marginTop: 3,
    },

    cardDivider: {
      height: 0.5,
      backgroundColor: isDark ? '#3A3A3A' : '#E8E4DF',
      marginTop: 10,
      marginBottom: 10,
    },

    cardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    cardDate: {
      fontSize: 11,
      color: '#8A8A8E',
    },
  });
};
