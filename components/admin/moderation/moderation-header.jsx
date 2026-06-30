import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

export function ModerationHeader({ count, onBack, styles }) {
  return (
    <View style={styles.header}>
      <Pressable
        style={styles.iconButton}
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Voltar"
      >
        <Ionicons name="arrow-back" size={20} color="#272A3A" />
      </Pressable>
      <View style={styles.headerText}>
        <Text style={styles.kicker}>Admin</Text>
        <Text style={styles.heading}>Moderação</Text>
        <Text style={styles.subtitle}>
          {count} {count === 1 ? 'denúncia pendente' : 'denúncias pendentes'}
        </Text>
      </View>
    </View>
  );
}
