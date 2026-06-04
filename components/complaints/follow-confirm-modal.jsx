import { Modal, Pressable, Text, View } from 'react-native';

export function FollowConfirmModal({
  visible,
  loading,
  onCancel,
  onConfirm,
  styles,
}) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.unfollowModalBackdrop}>
        <View style={styles.unfollowModalCard}>
          <Text style={styles.unfollowModalTitle}>
            Acompanhar esta denúncia?
          </Text>
          <Text style={styles.unfollowModalText}>
            Ao acompanhar, você receberá notificações sobre atualizações desta denúncia.
          </Text>

          <View style={styles.unfollowModalActions}>
            <Pressable
              style={styles.unfollowCancelButton}
              onPress={onCancel}
              disabled={loading}
            >
              <Text style={styles.unfollowCancelText}>Cancelar</Text>
            </Pressable>

            <Pressable
              style={[
                styles.unfollowConfirmButton,
                loading && styles.detailFollowButtonDisabled,
              ]}
              onPress={onConfirm}
              disabled={loading}
            >
              <Text style={styles.unfollowConfirmText}>Acompanhar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
