import { ActivityIndicator, Text, View } from 'react-native';

export function LoadingState({ styles }) {
  return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color="#FF6B35" />
      <Text style={styles.loadingText}>A carregar denúncias…</Text>
    </View>
  );
}