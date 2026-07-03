export const VALIDATION_STATUSES = ["awaiting_validation", "aguardando_validacao"];

export const DISPLAY_STATUSES = [
  ...VALIDATION_STATUSES,
  "resolved",
  "resolvido",
  "fechado",
  "closed",
];

export const REQUEST_REASON_LABELS = {
  already_resolved: "Denúncia já resolvida",
  false_report: "Denúncia falsa",
  needs_community_review: "Precisa de revisão da comunidade",
  evidence_selection: "Selecionar evidências para resolução",
  owner_inactive: "Autor não respondeu em 7 dias",
};
