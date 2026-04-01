import { StyleSheet } from 'react-native';

export const mapScreenStyles = (colorScheme) => {
  const isDark = colorScheme === 'dark';

  return StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },

    // ── Barra de pesquisa ──────────────────────────────
    searchContainer: {
      position: 'absolute',
      top: 100,
      left: 16,
      right: 16,
      zIndex: 10,
    },

    searchBar: {
      backgroundColor: isDark ? '#1C1C1E' : '#fff',
      borderRadius: 16,
      paddingHorizontal: 14,
      paddingVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 6,
    },

    searchInput: {
      flex: 1,
      fontSize: 14,
      color: isDark ? '#fff' : '#1C1C1E',
    },

    filterBtn: {
      width: 34,
      height: 34,
      backgroundColor: '#FF6B35',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // ── Botao de criar denuncia ────────────────────────────────────────────
    fab: {
      position: 'absolute',
      right: 16,
      bottom: 165,
      width: 52,
      height: 52,
      backgroundColor: '#FF6B35',
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 8,
    },

    // ── Botao centralizar usuario ────────────────────────────────────────────
    centerBtn: {
      position: 'absolute',
      right: 16,
      bottom: 225,
      width: 52,
      height: 52,
      backgroundColor: isDark ? '#1C1C1E' : '#fff',
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 8,
    },

    // ── Card inferior ──────────────────────────────────
    bottomCard: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      overflow: 'hidden',
      backgroundColor: isDark ? '#1C1C1E' : '#fff',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 20,
      paddingBottom: 25,
      paddingTop: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 0,
    },

    bottomHandle: {
      width: 36,
      height: 6,
      backgroundColor: isDark ? '#3A3A3A' : '#E8E4DF',
      borderRadius: 2,
      alignSelf: 'center',
      marginBottom: 14,
    },

    bottomTitle: {
      fontSize: 11,
      fontWeight: '700',
      color: isDark ? '#8A8A8E' : '#8A8A8E',
      letterSpacing: 1,
      marginBottom: 12,
    },

    miniCard: {
      backgroundColor: isDark ? '#2C2C2E' : '#F7F4F0',
      borderRadius: 16,
      padding: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      borderWidth: 1,
      borderColor: isDark ? '#3A3A3A' : '#E8E4DF',
    },

    miniCardPhoto: {
      width: 52,
      height: 52,
      borderRadius: 12,
      backgroundColor: '#FFB347',
      alignItems: 'center',
      justifyContent: 'center',
    },

    miniCardEmoji: { fontSize: 24 },
    miniCardInfo: { flex: 1 },
    miniCardTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: isDark ? '#fff' : '#1C1C1E',
      marginBottom: 3,
    },

    miniCardSub: {
      fontSize: 11,
      color: '#8A8A8E',
    },

    miniCardBadge: {
      backgroundColor: 'rgba(230,57,70,0.1)',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
    },
    
    miniCardBadgeText: {
      fontSize: 10,
      fontWeight: '700',
      color: '#E63946',
    },
  });
};