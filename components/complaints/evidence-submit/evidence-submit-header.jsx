import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

export function EvidenceSubmitHeader({ onClose, submitting, styles }) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onClose} disabled={submitting}>
        <Ionicons name="close" size={24} color="#333" />
      </Pressable>
      <Text style={styles.title}>Enviar Evidência</Text>
      <View style={styles.headerSpacer} />
    </View>
  );
}
