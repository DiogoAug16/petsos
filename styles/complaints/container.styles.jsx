import { StyleSheet } from 'react-native';

export const containerStyles = (colorScheme) => {
  const isDark = colorScheme === 'dark';

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#FFF6EC' : '#FFF6EC',
    },
  });
};
