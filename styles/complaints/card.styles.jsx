import { StyleSheet } from 'react-native';

const ORANGE = '#FF6B35';

export const cardStyles = (colorScheme) => {
  const isDark = colorScheme === 'dark';

  return StyleSheet.create({
    card: {
      backgroundColor: isDark ? '#242B3D' : '#FFFFFF',
      borderRadius: 16,
      padding: 14,
      borderWidth: 1,
      borderColor: isDark ? '#2F3749' : '#F0F0F0',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: isDark ? 0.3 : 0.06,
      shadowRadius: 12,
      elevation: 6,
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
      backgroundColor: isDark ? '#2F3749' : '#F0F0F0',
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
