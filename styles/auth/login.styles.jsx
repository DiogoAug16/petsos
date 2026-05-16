import { StyleSheet } from 'react-native';

export const createLoginStyles = (colors) => {
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
      marginBottom: 70,
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
      padding: 24,
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
    titleContainer: {
      alignItems: 'center',
      marginBottom: 8,
    },
    formTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
    },
    formSubtitle: {
      fontSize: 14,
      color: colors.tabIconDefault,
      textAlign: 'center',
      lineHeight: 20,
    },
    optionsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: -4,
    },
    rememberContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: colors.tabIconDefault,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxChecked: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    rememberText: {
      fontSize: 14,
      color: colors.text,
    },
    forgotPassword: {
      fontSize: 14,
      fontWeight: '600',
    },
    submitButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
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
    loginErrorText: {
      color: '#EF4444',
      fontSize: 13,
      fontWeight: '500',
      textAlign: 'center',
      marginTop: 12,
    },
    submitButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 16,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: isDark ? '#2F3749' : '#E0E0E0',
    },
    dividerText: {
      fontSize: 14,
      color: colors.tabIconDefault,
      marginHorizontal: 12,
    },
    socialContainer: {
      flexDirection: 'row',
      gap: 12,
    },
    socialButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: isDark ? '#1A1F2E' : '#2C3E50',
      borderRadius: 12,
      paddingVertical: 14,
      borderWidth: 1,
      borderColor: isDark ? '#2F3749' : '#34495E',
    },
    socialButtonText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '600',
    },
    linkContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 16,
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
