export const actionsStyles = (colorScheme) => {
  const isDark = colorScheme === 'dark';
  
  return {
    detailActionsFixed: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      gap: 8,
      padding: 14,
      backgroundColor: isDark ? '#000' : '#F7F4F0',
      borderTopWidth: 0.5,
      borderTopColor: isDark ? '#3A3A3A' : '#E8E4DF',
    },
    detailBtnHelp: {
      flex: 2,
      backgroundColor: '#FF6B35',
      borderRadius: 14,
      paddingVertical: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
    },
    detailBtnHelping: {
      backgroundColor: '#1A936F',
    },
    detailBtnHelpText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
    },
    detailBtnEdit: {
      flex: 1,
      backgroundColor: isDark ? '#1C1C1E' : '#fff',
      borderRadius: 14,
      paddingVertical: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      borderWidth: 0.5,
      borderColor: isDark ? '#3A3A3A' : '#E8E4DF',
    },
    detailBtnEditText: {
      color: isDark ? '#fff' : '#1C1C1E',
      fontSize: 14,
      fontWeight: '600',
    },
    detailBtnDelete: {
      width: 52,
      backgroundColor: isDark ? 'rgba(230,57,70,0.15)' : 'rgba(230,57,70,0.08)',
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 0.5,
      borderColor: isDark ? 'rgba(230,57,70,0.3)' : 'rgba(230,57,70,0.2)',
    },
  };
};
