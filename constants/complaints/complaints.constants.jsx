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
    photoColor: '#FFE2E7',
    emoji: '🐕',
  },
  negligencia: {
    label: 'Negligência',
    badge: 'badgeNegligencia',
    badgeText: 'badgeNegligenciaText',
    photoColor: '#DDF7EC',
    emoji: '🐈',
  },
  'maus-tratos fisicos': {
    label: 'Maus-tratos',
    badge: 'badgeMausTratos',
    badgeText: 'badgeMausTratosText',
    photoColor: '#FFE8C8',
    emoji: '🐕',
  },
  perdido: {
    label: 'Animal perdido',
    badge: 'badgeAnimalPerdido',
    badgeText: 'badgeAnimalPerdidoText',
    photoColor: '#E9E0FF',
    emoji: '🐾',
  },
  outro: {
    label: 'Outro',
    badge: 'badgeOutro',
    badgeText: 'badgeOutroText',
    photoColor: '#FFE8C8',
    emoji: '🐾',
  },
};

export const ANIMAL_TYPES = [
  { label: 'Cachorro', value: 'cachorro' },
  { label: 'Gato', value: 'gato' },
  { label: 'Passaro', value: 'passaro' },
  { label: 'Outro', value: 'outro' },
];

export const INITIAL_COMPLAINT_FORM = {
  title: '',
  description: '',
  type: '',
  animal: '',
  animalOther: '',
  locationMode: 'auto',
  photos: [],
  isAnonymous: false,
};

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
    color: '#E24B4A',
  },
  em_andamento: {
    container: 'statusEmAndamento',
    text: 'statusEmAndamentoText',
    label: '● Em andamento',
    color: '#3B82F6',
  },
  aguardando_validacao: {
    container: 'statusAguardandoValidacao',
    text: 'statusAguardandoValidacaoText',
    label: '● Aguardando validação',
    color: '#F59E0B',
  },
  resolvido: {
    container: 'statusResolvido',
    text: 'statusResolvidoText',
    label: '● Resolvido',
    color: '#10B981',
  },
  fechado: {
    container: 'statusFechado',
    text: 'statusFechadoText',
    label: '● Fechado',
    color: '#6B7280',
  },
};
