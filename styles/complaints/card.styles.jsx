import { StyleSheet } from 'react-native';

const ORANGE = '#FF9F1C';

export const cardStyles = () => {
  return StyleSheet.create({
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: 24,
      padding: 14,
      borderWidth: 1,
      borderColor: '#F0D8BF',
      shadowColor: '#7A3F12',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 2,
    },

    cardPressed: {
      borderColor: ORANGE,
      backgroundColor: '#FFFCF7',
    },

    cardTop: {
      flexDirection: 'row',
      gap: 12,
      alignItems: 'flex-start',
    },

    cardPhoto: {
      width: 62,
      height: 62,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.85)',
    },

    cardPhotoImage: {
      width: 62,
      height: 62,
      borderRadius: 20,
    },

    cardPhotoEmoji: {
      fontSize: 25,
    },

    cardBody: {
      flex: 1,
      minWidth: 0,
    },

    cardTitle: {
      fontSize: 15,
      fontWeight: '800',
      color: '#272A3A',
      marginBottom: 4,
      lineHeight: 20,
    },

    cardAddress: {
      fontSize: 12,
      color: '#8D7D78',
      marginTop: 4,
      lineHeight: 17,
      fontWeight: '600',
    },

    cardDivider: {
      height: 0.5,
      backgroundColor: '#F0D8BF',
      marginTop: 12,
      marginBottom: 12,
    },

    cardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    cardDate: {
      fontSize: 12,
      color: '#8D7D78',
      fontWeight: '700',
    },
  });
};
