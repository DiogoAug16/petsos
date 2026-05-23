import { ActivityIndicator, Modal, Pressable, Text, View } from 'react-native';
import { StatusBadge } from '@/components/complaints/status-badge';
import { STATUS_CONFIG } from '@/constants/complaints.constants';

export function StatusConfirmModal({
  visible,
  currentStatus,
  nextStatus,
  loading,
  onCancel,
  onConfirm,
  styles,
}) {
  const nextConfig = STATUS_CONFIG[nextStatus];

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.statusModalBackdrop}>
        <View style={styles.statusModalCard}>
          <Text style={styles.statusModalTitle}>Atualizar status</Text>
          <Text style={styles.statusModalText}>
            Deseja alterar o status desta denúncia?
          </Text>

          <View style={styles.statusModalTransition}>
            <StatusBadge status={currentStatus} styles={styles} />
            <Text style={styles.statusModalArrow}>→</Text>
            <StatusBadge status={nextStatus} styles={styles} />
          </View>

          <View style={styles.statusModalActions}>
            <Pressable
              style={styles.statusModalCancelButton}
              onPress={onCancel}
              disabled={loading}
            >
              <Text style={styles.statusModalCancelText}>Cancelar</Text>
            </Pressable>

            <Pressable
              style={[
                styles.statusModalConfirmButton,
                loading && { opacity: 0.65 },
              ]}
              onPress={onConfirm}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.statusModalConfirmText}>
                  {nextConfig?.nextLabel || 'Confirmar'}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
