import { Modal, Pressable, Text, View } from 'react-native';

export function UnvolunteerConfirmModal({
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
            Deixar de ser voluntário?
          </Text>
          <Text style={styles.unfollowModalText}>
            Se deixar de ser voluntário, você não será mais responsável por resolver esta denúncia.
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
              <Text style={styles.unfollowConfirmText}>Deixar voluntariado</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
