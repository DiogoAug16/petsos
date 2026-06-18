import { useHapticPress } from '@/hooks/useHapticPress';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

export function AuthPromptBottomSheet({
  visible,
  title,
  message,
  onClose,
  onLogin,
  onRegister,
}) {
  const handleClose = useHapticPress(onClose);
  const handleLogin = useHapticPress(onLogin);
  const handleRegister = useHapticPress(onRegister);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={handleClose} />

        <View style={styles.sheet}>
          <View style={styles.handle} />

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.actions}>
            <Pressable style={styles.primaryButton} onPress={handleRegister}>
              <Text style={styles.primaryText}>Criar conta</Text>
            </Pressable>

            <Pressable style={styles.secondaryButton} onPress={handleLogin}>
              <Text style={styles.secondaryText}>Entrar</Text>
            </Pressable>
          </View>

          <Pressable style={styles.cancelButton} onPress={handleClose}>
            <Text style={styles.cancelText}>Agora não</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 28,
  },
  handle: {
    alignSelf: 'center',
    width: 42,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#F0D8BF',
    marginBottom: 18,
  },
  title: {
    color: '#272A3A',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  message: {
    color: '#8D7D78',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 8,
  },
  actions: {
    gap: 10,
    marginTop: 20,
  },
  primaryButton: {
    minHeight: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9F1C',
  },
  primaryText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '900',
  },
  secondaryButton: {
    minHeight: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF6EC',
    borderWidth: 0.5,
    borderColor: '#F0D8BF',
  },
  secondaryText: {
    color: '#272A3A',
    fontSize: 15,
    fontWeight: '800',
  },
  cancelButton: {
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  cancelText: {
    color: '#8D7D78',
    fontSize: 14,
    fontWeight: '800',
  },
});
