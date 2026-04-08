export const COMPLAINT_TYPES = [
  { label: 'Abandono', value: 'abandono' },
  { label: 'Maus-tratos', value: 'maus-tratos fisicos' },
  { label: 'Negligência', value: 'negligencia' },
  { label: 'Animal perdido', value: 'perdido' },
  { label: 'Outro', value: 'outro' },
];

export const FILTER_CHIPS = [
  { label: 'Todas', value: null },
  ...COMPLAINT_TYPES.map(({ label, value }) => ({ label, value })),
];

export const TYPE_CONFIG = {
  abandono: {
    label: 'Abandono',
    badge: 'badgeAbandono',
    badgeText: 'badgeAbandonoText',
    photoColor: '#FFD4B8',
    emoji: '🐕',
  },
  negligencia: {
    label: 'Negligência',
    badge: 'badgeNegligencia',
    badgeText: 'badgeNegligenciaText',
    photoColor: '#B8EFD8',
    emoji: '🐈',
  },
  outro: {
    label: 'Outro',
    badge: 'badgeOutro',
    badgeText: 'badgeOutroText',
    photoColor: '#FFE5CC',
    emoji: '🐾',
  },
};

export const ANIMAL_TYPES = [
  { label: 'Cachorro', value: 'cachorro' },
  { label: 'Gato', value: 'gato' },
  { label: 'Passaro', value: 'passaro' },
  { label: 'Outros', value: 'outro' },
];

export const ANIMAL_EMOJI = {
  cachorro: '🐕',
  gato: '🐈',
  passaro: '🐦',
  outro: '🐾',
};

export const STATUS_CONFIG = {
  aberto: {
    container: 'statusAberto',
    text: 'statusAbertoText',
    label: '● Aberto',
  },
  resolvido: {
    container: 'statusResolvido',
    text: 'statusResolvidoText',
    label: '● Resolvido',
  },
};