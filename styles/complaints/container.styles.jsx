import { StyleSheet } from 'react-native';

export const containerStyles = (colorScheme) => {
  const isDark = colorScheme === 'dark';

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000' : '#F7F4F0',
    },
  });
};
