import { useHapticPress } from '@/hooks/ui/useHapticPress';
import { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const DISMISS_TRANSLATION = 90;
const DISMISS_VELOCITY = 650;
const DISMISS_OFFSET = 380;

export function AuthPromptBottomSheet({
  primaryLabel = 'Criar conta',
  secondaryLabel = 'Entrar',
  visible,
  title,
  message,
  onClose,
  onPrimaryPress,
  onSecondaryPress,
}) {
  const translateY = useSharedValue(0);
  const handleClose = useHapticPress(onClose);
  const handlePrimaryPress = useHapticPress(onPrimaryPress);
  const handleSecondaryPress = useHapticPress(onSecondaryPress);

  useEffect(() => {
    if (visible) {
      translateY.value = 0;
    }
  }, [translateY, visible]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateY.value = Math.max(0, event.translationY);
    })
    .onEnd((event) => {
      const shouldDismiss =
        event.translationY > DISMISS_TRANSLATION ||
        event.velocityY > DISMISS_VELOCITY;

      if (shouldDismiss) {
        translateY.value = withTiming(DISMISS_OFFSET, { duration: 180 }, () => {
          runOnJS(onClose)();
        });
        return;
      }

      translateY.value = withSpring(0, {
        damping: 18,
        stiffness: 220,
      });
    });

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={handleClose} />

        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.sheet, sheetStyle]}>
            <View style={styles.handle} />

            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>

            <View style={styles.actions}>
              <Pressable style={styles.primaryButton} onPress={handlePrimaryPress}>
                <Text style={styles.primaryText}>{primaryLabel}</Text>
              </Pressable>

              <Pressable
                style={styles.secondaryButton}
                onPress={handleSecondaryPress}
              >
                <Text style={styles.secondaryText}>{secondaryLabel}</Text>
              </Pressable>
            </View>

            <Pressable style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelText}>Agora não</Text>
            </Pressable>
          </Animated.View>
        </GestureDetector>
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
