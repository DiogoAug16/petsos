import { StyleSheet } from 'react-native';

export const bottomCardStyles = (colorScheme) => {
  const isDark = colorScheme === 'dark';

  return StyleSheet.create({
    bottomCard: {
     position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,

      height: 158,
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
      backgroundColor: isDark ? 'rgba(28,28,30,0.6)' : 'rgba(255,255,255,0.6)',
      borderRadius: 16,
      padding: 0, // padding interno real
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,

      // sombra leve
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.2 : 0.05,
      shadowRadius: 6,
      elevation: 3,
    },

    innerBorder: {
     flex: 1, // importante pra ocupar tudo
     borderRadius: 14,
     borderWidth: 1,
     borderColor: isDark ? '#3A3A3A' : '#E8E4DF',
     padding: 1,
    backgroundColor: isDark ? '#1C1C1E' : '#fff',
    },

    miniCardPhoto: {
      width: 52,
      height: 52,
      borderRadius: 12,
      backgroundColor: '#FFB347',
      alignItems: 'center',
      justifyContent: 'center',
    },

    miniCardEmoji: { 
      fontSize: 24 
    },
    
    miniCardInfo: { 
      flex: 1 
    },
    
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

      miniCardSubtitle: {
      fontSize: 13,
      color: '#666',
      flexShrink: 1, // ESSENCIAL
    },


  });
};
