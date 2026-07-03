import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

export function ModerationEmptyState({ styles }) {
  return (
    <View style={styles.emptyState}>
      <Ionicons name="checkmark-done-circle-outline" size={44} color="#1A936F" />
      <Text style={styles.emptyTitle}>Fila limpa</Text>
      <Text style={styles.emptyText}>Não há denúncias pendentes.</Text>
    </View>
  );
}
