export const heroStyles = (colorScheme) => {
  const isDark = colorScheme === 'dark';
  
  return {
    detailHero: {
      height: 220,
      backgroundColor: isDark ? '#1C1C1E' : '#FFD4B8',
      position: 'relative',
      overflow: 'hidden',
    },
    detailHeroContent: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    detailHeroEmoji: {
      fontSize: 64,
    },
    detailHeroImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
    },
    detailHeroHeader: {
      position: 'absolute',
      top: 50,
      left: 12,
      right: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      zIndex: 10,
    },
    detailIconButton: {
      width: 36,
      height: 36,
      backgroundColor: isDark ? 'rgba(42,42,42,0.9)' : 'rgba(255,255,255,0.9)',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 0.5,
      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
    },
    detailMapModalButton: {
      position: 'absolute',
      top: 20,
      left: 15,
      width: 36,
      height: 36,
      backgroundColor: isDark ? 'rgba(42,42,42,0.9)' : 'rgba(255,255,255,0.9)',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 0.5,
      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
    },
  };
};
