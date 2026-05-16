import { useEffect } from 'react';
import { useSharedValue, useAnimatedStyle, withTiming, withDelay, cancelAnimation } from 'react-native-reanimated';

export function useStaggeredAnimation(index, totalItems = 5) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);

  useEffect(() => {
    const delay = index * 100;

    opacity.value = withDelay(delay, withTiming(1, { duration: 600 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 500 }));

    return () => {
      cancelAnimation(opacity);
      cancelAnimation(translateY);
    };
  }, [index, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return animatedStyle;
}
