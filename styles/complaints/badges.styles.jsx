import { StyleSheet } from 'react-native';

const ORANGE = '#FF6B35';
const ORANGE_BG = 'rgba(255,107,53,0.1)';
const DANGER_BG = 'rgba(230,57,70,0.1)';
const DANGER_TEXT = '#A32D2D';
const SUCCESS_BG = 'rgba(26,147,111,0.1)';
const SUCCESS_TEXT = '#085041';
const abandono_bg = 'rgb(117, 177, 228, 0.1)'
const abanadono_text = '#518abb'
const animal_perdido_bg = 'rgb(241, 221, 72, 0.1)'
const animal_perdido_text = '#8a7c0e'
const maus_tratos_bg = 'rgba(230,57,70,0.1)';
const maus_tratos_text = '#A32D2D';
const negligencia_bg = 'rgba(237, 102, 114, 0.1)';
const negligencia_text = '#aa4a4a';


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
      backgroundColor: abandono_bg,
    },

    badgeAbandonoText: {
      color: abanadono_text,
    },

    badgeNegligencia: {
      backgroundColor: negligencia_bg,
    },

    badgeNegligenciaText: {
      color: negligencia_text,
    },

    badgeMausTratos: {
      backgroundColor: maus_tratos_bg,
    },

    badgeMausTratosText: {
      color: maus_tratos_text,
    },

    badgeAnimalPerdido: {
      backgroundColor: animal_perdido_bg,
    },

    badgeAnimalPerdidoText: {
      color: animal_perdido_text,
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
