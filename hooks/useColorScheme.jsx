import { useColorScheme as useColorSchemeCore } from 'react-native';

export const useColorScheme = () => {
  const coreScheme = useColorSchemeCore();

  if (!coreScheme || coreScheme === 'unspecified') return 'light';
  return coreScheme;
};