import { StyleSheet } from 'react-native';

const ORANGE = '#FF9F1C';
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

    statusEmAndamento: {
      backgroundColor: 'rgba(59,130,246,0.1)',
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 20,
    },

    statusEmAndamentoText: {
      fontSize: 10,
      fontWeight: '500',
      color: '#1D4ED8',
    },

    statusAguardandoValidacao: {
      backgroundColor: 'rgba(245,158,11,0.1)',
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 20,
    },

    statusAguardandoValidacaoText: {
      fontSize: 10,
      fontWeight: '500',
      color: '#92400E',
    },

    statusFechado: {
      backgroundColor: 'rgba(107,114,128,0.1)',
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 20,
    },

    statusFechadoText: {
      fontSize: 10,
      fontWeight: '500',
      color: '#374151',
    },
  });
};
