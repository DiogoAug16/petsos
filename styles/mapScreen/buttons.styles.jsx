import { StyleSheet } from 'react-native';

export const buttonsStyles = (colorScheme) => {
  const isDark = colorScheme === 'dark';

  return StyleSheet.create({
    fab: {
      position: 'absolute',
      right: 16,
      bottom: 165,
      width: 52,
      height: 52,
      backgroundColor: '#FF9F1C',
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 8,
    },

    centerBtn: {
      position: 'absolute',
      right: 16,
      bottom: 225,
      width: 52,
      height: 52,
      backgroundColor: isDark ? '#FFFCF7' : '#FFFFFF',
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 8,
    },
    
  });
};
