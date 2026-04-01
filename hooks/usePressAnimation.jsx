import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

export function usePressAnimation({ toScale = 0.97 } = {}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => { scale.value = withSpring(toScale) };
  const onPressOut = () => { scale.value = withSpring(1) };

  return { animatedStyle, onPressIn, onPressOut };
}