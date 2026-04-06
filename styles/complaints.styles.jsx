import { StyleSheet } from 'react-native';

const ORANGE = '#FF6B35';
const DANGER_BG = 'rgba(230,57,70,0.1)';
const DANGER_TEXT = '#A32D2D';
const SUCCESS_BG = 'rgba(26,147,111,0.1)';
const SUCCESS_TEXT = '#085041';
const ORANGE_BG = 'rgba(255,107,53,0.1)';

export const complaintsStyles = (colorScheme) => {
  const isDark = colorScheme === 'dark';

  return StyleSheet.create({
    // ── Estrutura ──────────────────────────────────────
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000' : '#F7F4F0',
    },

    // ── Header ─────────────────────────────────────────
    header: {
      paddingTop: 60,
      paddingBottom: 16,
      paddingHorizontal: 20,
      backgroundColor: isDark ? '#1C1C1E' : '#fff',
      flexDirection: 'row',              
      justifyContent: 'space-between',  
      alignItems: 'flex-start',        
    },

    headerTitle: {
      fontSize: 28,
      fontWeight: '700',
    },

    headerSubtitle: {
      fontSize: 13,
      color: '#8A8A8E',
      marginTop: 2,
    },

    // ── Lista ───────────────────────────────────────────
    listContent: {
      padding: 14,
      gap: 10,
    },

    // ── Card ────────────────────────────────────────────
    card: {
      backgroundColor: isDark ? '#1C1C1E' : '#fff',
      borderRadius: 16,
      padding: 14,
      borderWidth: 0.5,
      borderColor: isDark ? '#3A3A3A' : '#E8E4DF',
    },

    cardPressed: {
      borderColor: ORANGE,
      borderWidth: 1.5,
    },

    cardTop: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'flex-start',
    },

    cardPhoto: {
      width: 56,
      height: 56,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },

    cardPhotoEmoji: {
      fontSize: 22,
    },

    cardBody: {
      flex: 1,
    },

    cardTitle: {
      fontSize: 13,
      fontWeight: '500',
      color: isDark ? '#fff' : '#1C1C1E',
      marginBottom: 3,
      lineHeight: 18,
    },

    cardAddress: {
      fontSize: 11,
      color: '#8A8A8E',
      marginTop: 3,
    },

    cardDivider: {
      height: 0.5,
      backgroundColor: isDark ? '#3A3A3A' : '#E8E4DF',
      marginTop: 10,
      marginBottom: 10,
    },

    cardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    cardDate: {
      fontSize: 11,
      color: '#8A8A8E',
    },

    // ── Badges de tipo ───────────────────────────────────
    badgeBase: {
      alignSelf: 'flex-start',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 20,
      marginBottom: 5,
    },

    badgeTextBase: {
      fontSize: 10,
      fontWeight: '500',
    },

    badgeAbandono: {
      backgroundColor: DANGER_BG,
    },

    badgeAbandonoText: {
      color: DANGER_TEXT,
    },

    badgeNegligencia: {
      backgroundColor: SUCCESS_BG,
    },

    badgeNegligenciaText: {
      color: SUCCESS_TEXT,
    },

    badgeOutro: {
      backgroundColor: ORANGE_BG,
    },

    badgeOutroText: {
      color: ORANGE,
    },

    // ── Badge de status ──────────────────────────────────
    statusAberto: {
      backgroundColor: DANGER_BG,
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 20,
    },

    statusAbertoText: {
      fontSize: 10,
      fontWeight: '500',
      color: DANGER_TEXT,
    },

    statusResolvido: {
      backgroundColor: SUCCESS_BG,
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 20,
    },

    statusResolvidoText: {
      fontSize: 10,
      fontWeight: '500',
      color: SUCCESS_TEXT,
    },

    // ── Feedback states ──────────────────────────────────
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      padding: 32,
    },

    emptyStateContent: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      padding: 32,
    },

    loadingText: {
      fontSize: 13,
      color: '#8A8A8E',
    },

    errorIcon: {
      fontSize: 40,
    },

    errorTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#fff' : '#1C1C1E',
    },

    errorMessage: {
      fontSize: 13,
      color: '#8A8A8E',
      textAlign: 'center',
    },

    retryButton: {
      paddingHorizontal: 24,
      paddingVertical: 10,
      backgroundColor: ORANGE,
      borderRadius: 12,
    },

    retryButtonText: {
      fontSize: 13,
      fontWeight: '600',
      color: '#fff',
    },

    emptyIcon: {
      fontSize: 48,
    },

    emptyTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#fff' : '#1C1C1E',
    },

    emptySubtitle: {
      fontSize: 13,
      color: '#8A8A8E',
      textAlign: 'center',
    },
  
    // ── barra de pesquisa ──────────────────────────────────
    searchContainer: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: isDark ? '#1C1C1E' : '#fff',
    },

    searchBar: {
      backgroundColor: isDark ? '#2C2C2E' : '#F7F4F0',
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      borderWidth: 0.5,
      borderColor: isDark ? '#3A3A3A' : '#E8E4DF',
    },

    searchInput: {
      flex: 1,
      fontSize: 14,
      color: isDark ? '#fff' : '#1C1C1E',
    },

    filterBtn: {
      width: 30,
      height: 30,
      backgroundColor: '#FF6B35',
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};