import { ActivityIndicator, Text, View } from 'react-native';
import { complaintsStyles } from '@/styles/complaints';
import { useColorScheme } from '@/hooks/useColorScheme';

export function LoadingState() {
  const colorScheme = useColorScheme();
  const styles = complaintsStyles(colorScheme);

  return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color="#FF6B35" />
      <Text style={styles.loadingText}>A carregar denúncias…</Text>
    </View>
  );
}