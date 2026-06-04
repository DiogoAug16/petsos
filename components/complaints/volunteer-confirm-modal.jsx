import { Modal, Pressable, Text, View } from 'react-native';

export function VolunteerConfirmModal({
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
            Voluntariar-se nesta denúncia?
          </Text>
          <Text style={styles.unfollowModalText}>
            Ao se voluntariar, você assume a responsabilidade de ajudar a resolver esta denúncia e passará a acompanhá-la automaticamente.
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
              <Text style={styles.unfollowConfirmText}>Confirmar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
