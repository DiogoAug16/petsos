export const toastStyles = (colorScheme) => {
  const isDark = colorScheme === 'dark';
  
  return {
    detailToast: {
      backgroundColor: isDark ? 'rgba(26,147,111,0.15)' : 'rgba(26,147,111,0.1)',
      borderRadius: 14,
      padding: 14,
      borderWidth: 0.5,
      borderColor: isDark ? 'rgba(26,147,111,0.3)' : 'rgba(26,147,111,0.3)',
      marginTop: -4,
      marginBottom: 20,
    },
    detailToastTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: isDark ? '#1A936F' : '#085041',
    },
    detailToastSubtitle: {
      fontSize: 11,
      color: isDark ? '#2ECC9A' : '#0F6E56',
      marginTop: 4,
    },
  };
};
