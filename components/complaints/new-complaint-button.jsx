import { useRequireAuth } from '@/context/AuthPromptContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useHaptics } from '@/hooks/useHaptics';
import { newComplaintButtonStyles } from '@/styles/new-complaint-button.styles';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useRef } from 'react';
import { Animated, Text, TouchableOpacity } from 'react-native';

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
        title: 'Entre para criar uma denúncia',
        message:
          'Faça login ou crie uma conta para registrar uma denúncia.',
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
        <Text style={styles.buttonText}>+ Nova Denúncia</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
