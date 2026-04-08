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
  };
};
