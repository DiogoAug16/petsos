import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

export function RequestValidationCard({ onOpen, styles }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="people-circle-outline" size={20} color="#92400E" />
        <Text style={styles.title}>Votação da comunidade</Text>
      </View>

      <Text style={styles.description}>
        Abra uma votação para seguidores e voluntários revisarem esta denúncia.
      </Text>
      <Pressable style={styles.button} onPress={onOpen}>
        <Text style={styles.buttonText}>Solicitar votação</Text>
      </Pressable>
    </View>
  );
}
