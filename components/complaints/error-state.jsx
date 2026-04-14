import { Pressable, Text, View } from 'react-native';
import { complaintsStyles } from '@/styles/complaints';
import { useColorScheme } from '@/hooks/useColorScheme';

export function ErrorState({ message, onRetry }) {
  const colorScheme = useColorScheme();
  const styles = complaintsStyles(colorScheme);

  return (
    <View style={styles.centered}>
      <Text style={styles.errorIcon}>⚠️</Text>
      <Text style={styles.errorTitle}>Algo correu mal</Text>
      <Text style={styles.errorMessage}>{message}</Text>
      <Pressable style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryButtonText}>Tentar novamente</Text>
      </Pressable>
    </View>
  );
}