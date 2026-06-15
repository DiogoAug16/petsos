import { ActivityIndicator, Text, View } from 'react-native';
import { complaintsStyles } from '@/styles/complaints';
import { useColorScheme } from '@/hooks/useColorScheme';

export function LoadingState({ message = 'Carregando denúncias...' }) {
  const colorScheme = useColorScheme();
  const styles = complaintsStyles(colorScheme);

  return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color="#FF9F1C" />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
}
