import { useEffect } from 'react';
import { useSharedValue, useAnimatedStyle, withTiming, cancelAnimation } from 'react-native-reanimated';

export function useEntranceAnimation() {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 800 });
    translateY.value = withTiming(0, { duration: 700 });

    return () => {
      cancelAnimation(opacity);
      cancelAnimation(translateY);
    };
  }, [opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return animatedStyle;
}
