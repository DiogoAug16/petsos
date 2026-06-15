export const infoBarStyles = (colorScheme) => {
  const isDark = colorScheme === 'dark';
  
  return {
    detailHeroFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'transparent',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    detailPill: {
      paddingVertical: 4,
      paddingHorizontal: 12,
      borderRadius: 20,
      borderWidth: 0.5,
      borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#F0D8BF',
      backgroundColor: isDark ? 'rgba(36,43,61,0.9)' : 'rgba(255,255,255,0.9)',
    },
    detailPillText: {
      fontSize: 11,
      fontWeight: '600',
      color: isDark ? '#fff' : '#712B13',
    },
    detailMetaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    detailMetaText: {
      fontSize: 12,
      color: isDark ? '#fff' : '#4A4A4A',
      fontWeight: '500',
    },
    detailMetaIcon: {
      fontSize: 14,
    },
    statusUpdateContainer: {
      paddingHorizontal: 16,
      paddingBottom: 8,
    },
    statusUpdateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: '#FF9F1C',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 12,
    },
    statusUpdateButtonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
    },
    volunteerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: '#10B981',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 12,
    },
    volunteerButtonActive: {
      backgroundColor: isDark ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.1)',
      borderWidth: 1,
      borderColor: '#10B981',
    },
    volunteerButtonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
    },
    volunteerButtonActiveText: {
      color: '#10B981',
    },
    statusModalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.45)',
      justifyContent: 'flex-end',
    },
    statusModalCard: {
      backgroundColor: isDark ? '#FFFCF7' : '#FFFFFF',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 18,
      paddingBottom: 28,
    },
    statusModalTitle: {
      color: '#272A3A',
      fontSize: 18,
      fontWeight: '800',
    },
    statusModalText: {
      color: '#8D7D78',
      fontSize: 14,
      lineHeight: 20,
      marginTop: 8,
    },
    statusModalTransition: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      marginTop: 16,
      marginBottom: 8,
      paddingVertical: 12,
      backgroundColor: isDark ? '#F0D8BF' : '#FFF6EC',
      borderRadius: 12,
    },
    statusModalArrow: {
      fontSize: 18,
      color: '#8D7D78',
      fontWeight: '600',
    },
    statusModalActions: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 18,
    },
    statusModalCancelButton: {
      flex: 1,
      minHeight: 46,
      borderRadius: 12,
      borderWidth: 0.5,
      borderColor: isDark ? '#F0D8BF' : '#F0D8BF',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? '#F0D8BF' : '#FFF6EC',
    },
    statusModalCancelText: {
      color: '#272A3A',
      fontSize: 14,
      fontWeight: '700',
    },
    statusModalConfirmButton: {
      flex: 1,
      minHeight: 46,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FF9F1C',
    },
    statusModalConfirmText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '700',
    },
  };
};
