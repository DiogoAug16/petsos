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
    detailStatusPill: {
      paddingVertical: 4,
      paddingHorizontal: 12,
      borderRadius: 20,
    },
    detailStatusPillText: {
      fontSize: 11,
      fontWeight: '600',
      color: '#fff',
    },
    detailTypePill: {
      backgroundColor: isDark ? 'rgba(42,42,42,0.9)' : 'rgba(255,255,255,0.9)',
      paddingVertical: 4,
      paddingHorizontal: 12,
      borderRadius: 20,
      borderWidth: 0.5,
      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
    },
    detailTypePillText: {
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
      backgroundColor: '#FF6B35',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 12,
    },
    statusUpdateButtonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
    },
    statusModalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.45)',
      justifyContent: 'flex-end',
    },
    statusModalCard: {
      backgroundColor: isDark ? '#1C1C1E' : '#fff',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 18,
      paddingBottom: 28,
    },
    statusModalTitle: {
      color: isDark ? '#fff' : '#1C1C1E',
      fontSize: 18,
      fontWeight: '800',
    },
    statusModalText: {
      color: '#8A8A8E',
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
      backgroundColor: isDark ? '#2A2A2A' : '#F7F4F0',
      borderRadius: 12,
    },
    statusModalArrow: {
      fontSize: 18,
      color: '#8A8A8E',
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
      borderColor: isDark ? '#3A3A3A' : '#E8E4DF',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? '#2A2A2A' : '#F7F4F0',
    },
    statusModalCancelText: {
      color: isDark ? '#fff' : '#1C1C1E',
      fontSize: 14,
      fontWeight: '700',
    },
    statusModalConfirmButton: {
      flex: 1,
      minHeight: 46,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FF6B35',
    },
    statusModalConfirmText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '700',
    },
  };
};
