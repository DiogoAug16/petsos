import { StyleSheet } from 'react-native';

const ORANGE = '#FF6B35';

export const newComplaintButtonStyles = (colorScheme) => {
  const isDark = colorScheme === 'dark';

  return StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: isDark ? '#1C1C1E' : '#fff',
      borderTopWidth: 0.5,
      borderTopColor: isDark ? '#3A3A3A' : '#E8E4DF',
      paddingTop: 8,
      paddingBottom: 8,
      paddingHorizontal: 16,
    },

    button: {
      backgroundColor: ORANGE,
      borderRadius: 12,
      padding: 14,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },

    buttonText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 15,
    },
  });
};
