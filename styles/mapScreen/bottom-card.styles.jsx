import { StyleSheet } from 'react-native';

export const bottomCardStyles = (colorScheme) => {
  const isDark = colorScheme === 'dark';

  return StyleSheet.create({
    bottomCard: {
     position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,

      height: 115,          // ALTURA FIXA (recomendado)
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
      marginBottom: -10,
    },

    bottomTitle: {
      fontSize: 12,
      fontWeight: '700',
      color: isDark ? '#8a8b8e' : '#8A8A8E',
      letterSpacing: 1,
      marginBottom: -3,
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

    miniCardEmoji: { 
      fontSize: 24 
    },
    
    miniCardInfo: { 
      flex: 1 
    },
    
    miniCardTitle: {
      fontSize: 10,
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
