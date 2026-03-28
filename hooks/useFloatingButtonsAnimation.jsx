import { useRef } from 'react';
import { Animated } from 'react-native';

const WOBBLY_CONFIG = {
  useNativeDriver: true,
  tension: 40,
  friction: 5,
};

const RETURN_CONFIG = {
  useNativeDriver: true,
  tension: 60,
  friction: 8,
};

export function useFloatingButtonsAnimation() {
  const translateY = useRef(new Animated.Value(0)).current;

  const animateTo = (hidden) => {
    Animated.spring(translateY, {
      toValue: hidden ? 120 : 0,
      ...(hidden ? WOBBLY_CONFIG : RETURN_CONFIG),
    }).start();
  };

  return { translateY, animateTo };
}