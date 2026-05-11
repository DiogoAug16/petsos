import { Text, TouchableOpacity, Animated } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { newComplaintButtonStyles } from '@/styles/new-complaint-button.styles';
import { useRef, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useHaptics } from '@/hooks/useHaptics';
import { useRequireAuth } from '@/context/AuthPromptContext';

export function NewComplaintButton({ onPress }) {
  const colorScheme = useColorScheme();
  const styles = newComplaintButtonStyles(colorScheme);
  const slideAnim = useRef(new Animated.Value(75)).current;
  const router = useRouter();
  const { triggerHaptics } = useHaptics();
  const requireAuth = useRequireAuth();

  useFocusEffect(
    useCallback(() => {
      slideAnim.setValue(75);
      Animated.spring(slideAnim, {
        toValue: 3,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    }, [slideAnim])
  );

  const handlePress = () => {
    requireAuth(
      () => {
        triggerHaptics('normal');
        onPress?.();
        router.push('/complaint/create');
      },
      {
        title: 'Entre para criar uma denuncia',
        message:
          'Faca login ou crie uma conta para registrar uma denuncia.',
      },
    );
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>+ Nova Denuncia</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
