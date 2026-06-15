export const detailCardsStyles = (colorScheme) => {
  const isDark = colorScheme === 'dark';

  return {
    detailScreen: {
      flex: 1,
      backgroundColor: isDark ? '#1A1F2E' : '#E8F4F8',
    },
    detailContent: {
      padding: 14,
      gap: 12,
    },
    detailCard: {
      backgroundColor: isDark ? '#242B3D' : '#FFFFFF',
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: isDark ? '#2F3749' : '#F0F0F0',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: isDark ? 0.3 : 0.06,
      shadowRadius: 12,
      elevation: 6,
    },
    detailMainCard: {
      backgroundColor: isDark ? '#242B3D' : '#FFFFFF',
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: isDark ? '#2F3749' : '#F0F0F0',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: isDark ? 0.3 : 0.06,
      shadowRadius: 12,
      elevation: 6,
      gap: 10,
    },
    detailMainTitle: {
      fontSize: 19,
      fontWeight: '800',
      color: isDark ? '#fff' : '#1C1C1E',
      lineHeight: 25,
    },
    detailMainMetaRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 6,
    },
    detailMainMetaText: {
      flex: 1,
      fontSize: 13,
      color: '#8A8A8E',
      lineHeight: 18,
      fontWeight: '600',
    },
    detailMainDivider: {
      height: 0.5,
      backgroundColor: isDark ? '#2F3749' : '#F0F0F0',
    },
    detailMainSectionLabel: {
      fontSize: 10,
      fontWeight: '700',
      color: '#8A8A8E',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      marginBottom: -4,
    },
    detailMainDescription: {
      fontSize: 14,
      color: isDark ? '#EBEBF5' : '#1C1C1E',
      lineHeight: 21,
    },
    detailMainFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    detailMainRegistrar: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    detailMainRegistrarCopy: {
      flex: 1,
    },
    detailMainFollowersButton: {
      minHeight: 32,
      justifyContent: 'center',
    },
    detailMainFollowersText: {
      color: '#8A8A8E',
      fontSize: 12,
      fontWeight: '800',
    },
    detailSectionLabel: {
      fontSize: 10,
      fontWeight: '600',
      color: '#8A8A8E',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      marginBottom: 10,
    },
    detailMapContainer: {
      height: 100,
      backgroundColor: isDark ? '#2F3749' : '#F0F0F0',
      borderRadius: 10,
      overflow: 'hidden',
      marginBottom: 8,
    },
    detailMap: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    detailMapAddress: {
      fontSize: 12,
      color: '#8A8A8E',
    },
    detailRegistrarName: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#fff' : '#1C1C1E',
    },
    detailRegistrarDate: {
      fontSize: 12,
      color: '#8A8A8E',
      marginTop: 2,
    },
  };
};
