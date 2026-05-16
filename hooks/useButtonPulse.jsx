import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';

export function useButtonPulse(isLoading) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isLoading) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 400 }),
          withTiming(1, { duration: 400 })
        ),
        -1,
        false
      );
    } else {
      scale.value = withTiming(1, { duration: 200 });
    }

    return () => {
      cancelAnimation(scale);
    };
  }, [isLoading, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return animatedStyle;
}
