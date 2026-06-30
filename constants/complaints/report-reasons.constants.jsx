export const COMMENT_REPORT_REASONS = [
  { value: 'offensive_content', label: 'Conteúdo ofensivo' },
  { value: 'harassment', label: 'Assédio ou ataque' },
  { value: 'spam', label: 'Spam ou golpe' },
  { value: 'misinformation', label: 'Informação falsa' },
  { value: 'other', label: 'Outro motivo' },
];

export const COMPLAINT_REPORT_REASONS = [
  { value: 'false_report', label: 'Denúncia falsa' },
  { value: 'inappropriate_content', label: 'Conteúdo inadequado' },
  { value: 'duplicate', label: 'Denúncia duplicada' },
  { value: 'wrong_information', label: 'Informações incorretas' },
  { value: 'other', label: 'Outro motivo' },
];

export const REPORT_REASON_LABELS = [
  ...COMMENT_REPORT_REASONS,
  ...COMPLAINT_REPORT_REASONS,
].reduce((labels, reason) => {
  labels[reason.value] = reason.label;
  return labels;
}, {});
