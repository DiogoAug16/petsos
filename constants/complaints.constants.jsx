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
    photoColor: '#B8EFD8',
    emoji: '🐕',
  },
  negligencia: {
    label: 'Negligência',
    badge: 'badgeNegligencia',
    badgeText: 'badgeNegligenciaText',
    photoColor: '#B8EFD8',
    emoji: '🐈',
  },
  'maus-tratos fisicos': {
    label: 'Maus-tratos',
    badge: 'badgeMausTratos',
    badgeText: 'badgeMausTratosText',
    photoColor: '#B8EFD8',
    emoji: '🐕',
  },
  perdido: {
    label: 'Animal perdido',
    badge: 'badgeAnimalPerdido',
    badgeText: 'badgeAnimalPerdidoText',
    photoColor: '#B8EFD8',
    emoji: '🐾',
  },
  outro: {
    label: 'Outro',
    badge: 'badgeOutro',
    badgeText: 'badgeOutroText',
    photoColor: '#B8EFD8',
    emoji: '🐾',
  },
};

export const ANIMAL_TYPES = [
  { label: 'Cachorro', value: 'cachorro' },
  { label: 'Gato', value: 'gato' },
  { label: 'Passaro', value: 'passaro' },
  { label: 'Outro', value: 'outro' },
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
    color: '#E24B4A',
    nextStatus: 'em_andamento',
    nextLabel: 'Marcar em andamento',
  },
  em_andamento: {
    container: 'statusEmAndamento',
    text: 'statusEmAndamentoText',
    label: '● Em andamento',
    color: '#3B82F6',
    nextStatus: 'aguardando_validacao',
    nextLabel: 'Enviar para validação',
  },
  aguardando_validacao: {
    container: 'statusAguardandoValidacao',
    text: 'statusAguardandoValidacaoText',
    label: '● Aguardando validação',
    color: '#F59E0B',
    nextStatus: 'resolvido',
    nextLabel: 'Marcar como resolvido',
  },
  resolvido: {
    container: 'statusResolvido',
    text: 'statusResolvidoText',
    label: '● Resolvido',
    color: '#10B981',
    nextStatus: null,
    nextLabel: null,
  },
  fechado: {
    container: 'statusFechado',
    text: 'statusFechadoText',
    label: '● Fechado',
    color: '#6B7280',
    nextStatus: null,
    nextLabel: null,
  },
};
