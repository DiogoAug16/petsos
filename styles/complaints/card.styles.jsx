import { StyleSheet } from 'react-native';

const ORANGE = '#FF9F1C';

export const cardStyles = (colorScheme) => {
  const isDark = colorScheme === 'dark';

  return StyleSheet.create({
    card: {
      backgroundColor: isDark ? '#FFFCF7' : '#FFFFFF',
      borderRadius: 16,
      padding: 14,
      borderWidth: 1,
      borderColor: isDark ? '#F0D8BF' : '#F0D8BF',
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
      color: isDark ? '#fff' : '#272A3A',
      marginBottom: 3,
      lineHeight: 18,
    },

    cardAddress: {
      fontSize: 11,
      color: '#8D7D78',
      marginTop: 3,
    },

    cardDivider: {
      height: 0.5,
      backgroundColor: isDark ? '#F0D8BF' : '#F0D8BF',
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
      color: '#8D7D78',
    },
  });
};
