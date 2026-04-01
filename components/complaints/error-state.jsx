import { Pressable, Text, View } from 'react-native';

export function ErrorState({ message, onRetry, styles }) {
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