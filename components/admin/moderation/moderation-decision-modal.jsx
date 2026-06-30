import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

export function ModerationDecisionModal({
  action,
  reason,
  submitting,
  styles,
  onChangeReason,
  onClose,
  onSubmit,
}) {
  return (
    <Modal
      transparent
      visible={Boolean(action)}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <View style={styles.modalTitleRow}>
            {action ? (
              <Ionicons name={action.icon} size={22} color={action.color} />
            ) : null}
            <Text style={styles.modalTitle}>{action?.title}</Text>
          </View>
          <Text style={styles.modalText}>
            O motivo será enviado para a API e registrado na decisão administrativa.
          </Text>
          <TextInput
            value={reason}
            onChangeText={onChangeReason}
            placeholder="Motivo da decisão"
            placeholderTextColor="#8D7D78"
            multiline
            style={styles.reasonInput}
            textAlignVertical="top"
          />
          <View style={styles.modalActions}>
            <Pressable
              style={styles.cancelButton}
              onPress={onClose}
              disabled={submitting}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={[
                styles.confirmButton,
                action && { backgroundColor: action.color },
                submitting && styles.disabledButton,
              ]}
              onPress={onSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.confirmText}>Enviar</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
