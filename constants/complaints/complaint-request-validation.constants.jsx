export const REQUEST_VALIDATION_ALLOWED_STATUSES = [
  'aberto',
  'em_andamento',
  'aguardando_validacao',
];

export const REQUEST_VALIDATION_REASONS = [
  {
    type: 'already_resolved',
    label: 'Denúncia já resolvida',
  },
  {
    type: 'false_report',
    label: 'Denúncia falsa',
  },
  {
    type: 'needs_community_review',
    label: 'Precisa de revisão da comunidade',
  },
  {
    type: 'evidence_selection',
    label: 'Selecionar evidências para resolução',
  },
];
