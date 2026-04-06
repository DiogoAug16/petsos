import { StyleSheet } from 'react-native';

const ORANGE = '#FF6B35';
const DANGER_BG = 'rgba(230,57,70,0.1)';
const DANGER_TEXT = '#A32D2D';
const SUCCESS_BG = 'rgba(26,147,111,0.1)';
const SUCCESS_TEXT = '#085041';
const ORANGE_BG = 'rgba(255,107,53,0.1)';

export const badgeStyles = (colorScheme) => {
  return StyleSheet.create({
    badgeBase: {
      alignSelf: 'flex-start',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 20,
      marginBottom: 5,
    },

    badgeTextBase: {
      fontSize: 10,
      fontWeight: '500',
    },

    badgeAbandono: {
      backgroundColor: DANGER_BG,
    },

    badgeAbandonoText: {
      color: DANGER_TEXT,
    },

    badgeNegligencia: {
      backgroundColor: SUCCESS_BG,
    },

    badgeNegligenciaText: {
      color: SUCCESS_TEXT,
    },

    badgeOutro: {
      backgroundColor: ORANGE_BG,
    },

    badgeOutroText: {
      color: ORANGE,
    },

    statusAberto: {
      backgroundColor: DANGER_BG,
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 20,
    },

    statusAbertoText: {
      fontSize: 10,
      fontWeight: '500',
      color: DANGER_TEXT,
    },

    statusResolvido: {
      backgroundColor: SUCCESS_BG,
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 20,
    },

    statusResolvidoText: {
      fontSize: 10,
      fontWeight: '500',
      color: SUCCESS_TEXT,
    },
  });
};
