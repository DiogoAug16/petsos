export const detailMenuStyles = (colorScheme) => {
  const isDark = colorScheme === 'dark';
  const card = isDark ? '#FFFCF7' : '#FFFFFF';
  const text = isDark ? '#fff' : '#272A3A';
  const border = isDark ? '#F0D8BF' : '#F0D8BF';

  return {
    detailIconButtonPlaceholder: {
      width: 36,
      height: 36,
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
      borderRadius: 14,
      borderWidth: 0.5,
      borderColor: border,
      overflow: 'hidden',
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.16,
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
      fontWeight: '600',
      color: text,
    },
    detailHeroMenuDangerText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#E24B4A',
    },
  };
};
