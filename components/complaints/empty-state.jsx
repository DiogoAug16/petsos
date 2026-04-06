import { Text, View } from 'react-native';
import { complaintsStyles } from '@/styles/complaints.styles';
import { useColorScheme } from '@/hooks/useColorScheme';

export function EmptyState() {
  const colorScheme = useColorScheme();
  const styles = complaintsStyles(colorScheme);

  return (
    <View style={styles.centered}>
      <Text style={styles.emptyIcon}>🐾</Text>
      <Text style={styles.emptyTitle}>Sem denúncias</Text>
      <Text style={styles.emptySubtitle}>
        Ainda não há denúncias registadas.
      </Text>
    </View>
  );
}