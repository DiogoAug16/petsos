import { StyleSheet } from 'react-native';

const ORANGE = '#FF9F1C';
const ORANGE_BG = '#FFE8C8';
const DANGER_BG = '#FFE2E7';
const DANGER_TEXT = '#B83649';
const SUCCESS_BG = '#DDF7EC';
const SUCCESS_TEXT = '#1A936F';
const ABANDONO_BG = '#FFE2E7';
const ABANDONO_TEXT = '#B83649';
const ANIMAL_PERDIDO_BG = '#E9E0FF';
const ANIMAL_PERDIDO_TEXT = '#7C5CFF';
const MAUS_TRATOS_BG = '#FFE8C8';
const MAUS_TRATOS_TEXT = '#A84F16';
const NEGLIGENCIA_BG = '#DDF7EC';
const NEGLIGENCIA_TEXT = '#1A936F';

const statusPill = {
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 999,
  borderWidth: 0.5,
  borderColor: 'rgba(255,255,255,0.75)',
};

const statusText = {
  fontSize: 10,
  fontWeight: '800',
};

export const badgeStyles = () => {
  return StyleSheet.create({
    badgeBase: {
      alignSelf: 'flex-start',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      marginBottom: 6,
      borderWidth: 0.5,
      borderColor: 'rgba(255,255,255,0.75)',
    },

    badgeTextBase: {
      fontSize: 10,
      fontWeight: '800',
    },

    badgeAbandono: {
      backgroundColor: ABANDONO_BG,
    },

    badgeAbandonoText: {
      color: ABANDONO_TEXT,
    },

    badgeNegligencia: {
      backgroundColor: NEGLIGENCIA_BG,
    },

    badgeNegligenciaText: {
      color: NEGLIGENCIA_TEXT,
    },

    badgeMausTratos: {
      backgroundColor: MAUS_TRATOS_BG,
    },

    badgeMausTratosText: {
      color: MAUS_TRATOS_TEXT,
    },

    badgeAnimalPerdido: {
      backgroundColor: ANIMAL_PERDIDO_BG,
    },

    badgeAnimalPerdidoText: {
      color: ANIMAL_PERDIDO_TEXT,
    },

    badgeOutro: {
      backgroundColor: ORANGE_BG,
    },

    badgeOutroText: {
      color: ORANGE,
    },

    statusAberto: {
      backgroundColor: DANGER_BG,
      ...statusPill,
    },

    statusAbertoText: {
      ...statusText,
      color: DANGER_TEXT,
    },

    statusResolvido: {
      backgroundColor: SUCCESS_BG,
      ...statusPill,
    },

    statusResolvidoText: {
      ...statusText,
      color: SUCCESS_TEXT,
    },

    statusEmAndamento: {
      backgroundColor: '#E7F0FF',
      ...statusPill,
    },

    statusEmAndamentoText: {
      ...statusText,
      color: '#2F64C8',
    },

    statusAguardandoValidacao: {
      backgroundColor: '#FFF1D6',
      ...statusPill,
    },

    statusAguardandoValidacaoText: {
      ...statusText,
      color: '#A84F16',
    },

    statusFechado: {
      backgroundColor: '#ECE7E2',
      ...statusPill,
    },

    statusFechadoText: {
      ...statusText,
      color: '#6F625B',
    },
  });
};
