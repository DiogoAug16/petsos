export const detailCardsStyles = (colorScheme) => {
  const isDark = colorScheme === 'dark';
  
  return {
    detailScreen: {
      flex: 1,
      backgroundColor: isDark ? '#000' : '#F7F4F0',
    },
    detailContent: {
      padding: 14,
      gap: 12,
    },
    detailCard: {
      backgroundColor: isDark ? '#1C1C1E' : '#fff',
      borderRadius: 14,
      padding: 14,
      borderWidth: 0.5,
      borderColor: isDark ? '#3A3A3A' : '#E8E4DF',
    },
    detailSectionLabel: {
      fontSize: 10,
      fontWeight: '600',
      color: '#8A8A8E',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      marginBottom: 10,
    },
    detailTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#fff' : '#1C1C1E',
      lineHeight: 24,
      marginBottom: 10,
    },
    detailMetaContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    detailDescription: {
      fontSize: 14,
      color: isDark ? '#EBEBF5' : '#1C1C1E',
      lineHeight: 22,
    },
    detailMapContainer: {
      height: 100,
      backgroundColor: isDark ? '#2A2A2A' : '#C8D8C0',
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
    detailRegistrarRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    detailAvatar: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: '#2ECC9A',
      alignItems: 'center',
      justifyContent: 'center',
    },
    detailAvatarText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 16,
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
