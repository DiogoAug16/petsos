export const detailMenuStyles = () => {
  const card = '#FFFFFF';
  const text = '#272A3A';
  const border = '#F0D8BF';

  return {
    detailIconButtonPlaceholder: {
      width: 44,
      height: 44,
    },
    detailMenuBackdrop: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    detailMenuDismissArea: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    detailHeroMenu: {
      position: 'absolute',
      width: 168,
      backgroundColor: card,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: border,
      overflow: 'hidden',
      elevation: 8,
      shadowColor: '#7A3F12',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
    },
    detailHeroMenuItem: {
      minHeight: 48,
      paddingHorizontal: 14,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    detailHeroMenuText: {
      fontSize: 14,
      fontWeight: '800',
      color: text,
    },
    detailHeroMenuDangerText: {
      fontSize: 14,
      fontWeight: '800',
      color: '#E24B4A',
    },
  };
};
