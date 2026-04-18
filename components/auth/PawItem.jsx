import { useEffect } from 'react';
import { Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  interpolate,
} from 'react-native-reanimated';
import { styles } from '@/styles/auth/paw-background.styles';

export default function PawItem({ config, index, isDark }) {
  const fadeAnim = useSharedValue(0);
  const floatAnim = useSharedValue(0);

  useEffect(() => {
    fadeAnim.value = withDelay(
      300 + index * 120,
      withTiming(1, { duration: 800 })
    );

    floatAnim.value = withDelay(
      config.delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: config.duration }),
          withTiming(0, { duration: config.duration })
        ),
        -1,
        false
      )
    );
  }, [config.delay, config.duration, fadeAnim, floatAnim, index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [
      {
        translateY: interpolate(
          floatAnim.value,
          [0, 1],
          config.floatRange
        ),
      },
      {
        rotate: interpolate(
          floatAnim.value,
          [0, 1],
          [parseFloat(config.rotateStart), parseFloat(config.rotateEnd)]
        ) + 'deg',
      },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.pawPrint,
        {
          top: config.top,
          left: config.left,
        },
        animatedStyle,
      ]}
    >
      <Image
        source={require('@/assets/images/pets/paw.png')}
        style={[
          styles.pawImage,
          {
            opacity: isDark ? 0.3 : 0.4,
            tintColor: isDark ? '#6B7A94' : '#7FB3CC',
          },
        ]}
        resizeMode="contain"
      />
    </Animated.View>
  );
}
