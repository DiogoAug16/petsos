import { StyleSheet } from 'react-native';

export const headerStyles = () => {
  return StyleSheet.create({
    headerWrapper: {
      paddingHorizontal: 16,
      paddingBottom: 8,
    },

    header: {
      paddingVertical: 18,
      paddingHorizontal: 18,
      minHeight: 102,
      backgroundColor: '#FFE8C8',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#F0D8BF',
      borderRadius: 26,
      shadowColor: '#7A3F12',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.06,
      shadowRadius: 14,
      elevation: 2,
    },

    headerTitle: {
      fontSize: 28,
      fontWeight: '900',
      letterSpacing: 0,
    },

    headerTitlePrimary: {
      color: '#272A3A',
    },

    headerTitleAccent: {
      color: '#FF8C42',
    },

    headerSubtitle: {
      fontSize: 14,
      color: '#8D7D78',
      marginTop: 4,
      fontWeight: '700',
      lineHeight: 20,
    },

    headerLogoWrap: {
      width: 66,
      height: 66,
      borderRadius: 24,
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },

    headerLogo: {
      width: 66,
      height: 66,
    },
  });
};
