export const MODERATION_ACTIONS = {
  approve: {
    label: 'Aprovar',
    title: 'Aprovar denúncia',
    icon: 'checkmark-circle-outline',
    color: '#1A936F',
  },
  reject: {
    label: 'Rejeitar',
    title: 'Rejeitar denúncia',
    icon: 'close-circle-outline',
    color: '#E94B5F',
  },
  hide: {
    label: 'Ocultar',
    title: 'Ocultar denúncia',
    icon: 'eye-off-outline',
    color: '#7C5CFF',
  },
};

export const COMMENT_MODERATION_ACTIONS = {
  approve: {
    label: 'Aceitar',
    title: 'Aceitar comentário',
    icon: 'checkmark-circle-outline',
    color: '#1A936F',
  },
  reject: {
    label: 'Apagar',
    title: 'Apagar comentário',
    icon: 'trash-outline',
    color: '#E94B5F',
  },
  hide: {
    label: 'Ocultar',
    title: 'Ocultar comentário',
    icon: 'eye-off-outline',
    color: '#7C5CFF',
  },
};

export const getModerationActions = (item) =>
  item?.targetType === 'comment' ? COMMENT_MODERATION_ACTIONS : MODERATION_ACTIONS;
