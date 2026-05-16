import { useMemo, useCallback, useRef } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import PawItem from './PawItem';

const { width, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function PawBackground({ isDark }) {
  const containerOpacity = useSharedValue(0);
  const loadedRef = useRef(0);
  const revealedRef = useRef(false);

  const pawConfigs = useMemo(() => {
    const rotations = ['-25', '-15', '-10', '10', '15', '20', '25'];

    const SPACING_X = 100;
    const SPACING_Y = 90;

    const cols = Math.ceil(width / SPACING_X);
    const rows = Math.ceil(SCREEN_HEIGHT / SPACING_Y);

    const MAX_PAWS = 40;

    const configs = [];

    for (let row = 0; row < rows && configs.length < MAX_PAWS; row++) {
      for (let col = 0; col < cols && configs.length < MAX_PAWS; col++) {
        const offset = (row % 2) * (SPACING_X / 2);
        const left = col * SPACING_X + offset;
        const top = row * SPACING_Y;

        if (left >= 0 && left <= width && top >= 0 && top <= SCREEN_HEIGHT) {
          const rotateStart = rotations[Math.floor(Math.random() * rotations.length)];

          configs.push({
            left,
            top,
            rotateStart,
            floatRange: [-(Math.random() * 12 + 6), 0],
            duration: Math.random() * 800 + 2700,
          });
        }
      }
    }

    return configs;
  }, []);

  const onImageLoaded = useCallback(() => {
    loadedRef.current += 1;
    if (!revealedRef.current && loadedRef.current >= pawConfigs.length) {
      revealedRef.current = true;
      containerOpacity.value = withTiming(1, { duration: 500 });
    }
  }, [pawConfigs.length, containerOpacity]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {pawConfigs.map((config, index) => (
        <PawItem key={index} config={config} isDark={isDark} onImageLoaded={onImageLoaded} />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
});
