import { StyleSheet } from 'react-native';

export const headerStyles = (colorScheme) => {
  const isDark = colorScheme === 'dark';

  return StyleSheet.create({
    header: {
      paddingTop: 60,
      paddingBottom: 16,
      paddingHorizontal: 20,
      backgroundColor: isDark ? '#FFFCF7' : '#FFFFFF',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      borderBottomWidth: 0.5,
      borderBottomColor: isDark ? '#F0D8BF' : '#F0D8BF',
    },

    headerTitle: {
      fontSize: 28,
      fontWeight: '700',
    },

    headerSubtitle: {
      fontSize: 13,
      color: '#8D7D78',
      marginTop: 2,
    },
  });
};
