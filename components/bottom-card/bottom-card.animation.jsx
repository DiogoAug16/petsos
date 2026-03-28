import { useRef, useState } from 'react';
import { Animated, PanResponder } from 'react-native';

const HANDLE_HEIGHT = 24;
const SPRING_CONFIG = {
  useNativeDriver: true,
  tension: 80,
  friction: 12,
  overshootClamping: true,
};
const SPRING_CONFIG_BOUNCE = {
  useNativeDriver: true,
  tension: 80,
  friction: 12,
  overshootClamping: true,
};

export function useBottomCardAnimation(initialHeight = 160, onHiddenChange) {
  const translateY = useRef(new Animated.Value(0)).current;
  const [isHidden, setIsHidden] = useState(false);
  const [cardHeight, setCardHeight] = useState(initialHeight);

  const isHiddenRef = useRef(false);
  const cardHeightRef = useRef(initialHeight);
  const onHiddenChangeRef = useRef(onHiddenChange);

  onHiddenChangeRef.current = onHiddenChange;
  cardHeightRef.current = cardHeight;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 5,

      onPanResponderMove: (_, gestureState) => {
        const hiddenOffset = cardHeightRef.current - HANDLE_HEIGHT;

        if (gestureState.dy > 0 && !isHiddenRef.current) {
          translateY.setValue(gestureState.dy);
        } else if (gestureState.dy < 0 && isHiddenRef.current) {
          const next = hiddenOffset + gestureState.dy;
          translateY.setValue(Math.max(0, next));
        }
      },

      onPanResponderRelease: (_, gestureState) => {
        const hiddenOffset = cardHeightRef.current - HANDLE_HEIGHT;

        if (gestureState.dy > 60 && !isHiddenRef.current) {
          isHiddenRef.current = true;
          setIsHidden(true);
          onHiddenChangeRef.current?.(true);
          Animated.spring(translateY, {
            toValue: hiddenOffset,
            ...SPRING_CONFIG,
          }).start();
        } else if (gestureState.dy < -60 && isHiddenRef.current) {
          isHiddenRef.current = false;
          setIsHidden(false);
          onHiddenChangeRef.current?.(false);
          Animated.spring(translateY, {
            toValue: 0,
            ...SPRING_CONFIG_BOUNCE,
          }).start();
        } else {
          Animated.spring(translateY, {
            toValue: isHiddenRef.current ? hiddenOffset : 0,
            ...SPRING_CONFIG,
          }).start();
        }
      },
    })
  ).current;

  return { translateY, panResponder, cardHeight, setCardHeight, isHidden };
}