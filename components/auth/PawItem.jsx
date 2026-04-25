import { useEffect, memo } from 'react';
import { Image, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  interpolate,
  cancelAnimation,
} from 'react-native-reanimated';
import { pawBackgroundStyles as styles } from '@/styles/auth';

function PawItem({ config, isDark, onImageLoaded }) {
  const floatAnim = useSharedValue(0);

  useEffect(() => {
    floatAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: config.duration }),
        withTiming(0, { duration: config.duration })
      ),
      -1,
      false
    );

    return () => {
      cancelAnimation(floatAnim);
    };
  }, [config.duration, floatAnim]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          floatAnim.value,
          [0, 1],
          config.floatRange
        ),
      },
    ],
  }));

  return (
    <View
      style={[
        styles.pawPrint,
        {
          top: config.top,
          left: config.left,
          transform: [{ rotate: config.rotateStart + 'deg' }],
        },
      ]}
    >
      <Animated.View style={floatStyle}>
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
        onLoad={onImageLoaded}
        />
      </Animated.View>
    </View>
  );
}

export default memo(PawItem);
