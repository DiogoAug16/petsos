import { StyleSheet } from 'react-native';

export const headerStyles = (colorScheme) => {
  const isDark = colorScheme === 'dark';

  return StyleSheet.create({
    header: {
      paddingTop: 60,
      paddingBottom: 16,
      paddingHorizontal: 20,
      backgroundColor: isDark ? '#242B3D' : '#FFFFFF',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      borderBottomWidth: 0.5,
      borderBottomColor: isDark ? '#2F3749' : '#F0F0F0',
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
  });
};
