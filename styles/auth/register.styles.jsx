import { StyleSheet } from 'react-native';

export const createRegisterStyles = (colors) => {
  const isDark = colors.background === '#000';

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#1A1F2E' : '#E8F4F8',
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingTop: 70,
      paddingBottom: 20,
    },
    heroSection: {
      alignItems: 'center',
      marginBottom: 28,
    },
    headerTextContainer: {
      alignItems: 'center',
      gap: 6,
    },
    brandName: {
      fontSize: 48,
      fontWeight: '900',
      color: colors.text,
      letterSpacing: 1,
    },
    brandSOS: {
      fontSize: 48,
      fontWeight: '900',
      letterSpacing: 1,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      textAlign: 'center',
      letterSpacing: -0.3,
    },
    subtitle: {
      fontSize: 14,
      color: colors.tabIconDefault,
      textAlign: 'center',
      lineHeight: 20,
    },
    formCard: {
      backgroundColor: isDark ? '#242B3D' : '#FFFFFF',
      borderRadius: 20,
      padding: 20,
      gap: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: isDark ? 0.3 : 0.06,
      shadowRadius: 12,
      elevation: 6,
      borderWidth: 1,
      borderColor: isDark ? '#2F3749' : '#F0F0F0',
      overflow: 'visible',
    },
    submitButton: {
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingVertical: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginTop: 4,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 8,
      overflow: 'hidden',
    },
    submitButtonDisabled: {
      opacity: 0.5,
    },
    submitButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '800',
      letterSpacing: 0.5,
    },
    linkContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 8,
    },
    linkText: {
      fontSize: 14,
      color: colors.tabIconDefault,
    },
    link: {
      fontSize: 14,
      fontWeight: '700',
    },
  });
};
