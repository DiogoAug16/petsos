import { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

export function useInputAnimation() {
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  const handleFocus = () => {
    scale.value = withSpring(1.02, { damping: 15 });
    glowOpacity.value = withTiming(1, { duration: 200 });
  };

  const handleBlur = () => {
    scale.value = withSpring(1, { damping: 15 });
    glowOpacity.value = withTiming(0, { duration: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return { animatedStyle, glowStyle, handleFocus, handleBlur };
}
