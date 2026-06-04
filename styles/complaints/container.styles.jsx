import { StyleSheet } from 'react-native';

export const containerStyles = (colorScheme) => {
  const isDark = colorScheme === 'dark';

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#1A1F2E' : '#E8F4F8',
    },
  });
};
