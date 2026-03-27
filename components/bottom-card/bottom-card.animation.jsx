import { useRef, useState } from 'react';
import { Animated, PanResponder } from 'react-native';

const HANDLE_HEIGHT = 24;

export function useBottomCardAnimation(initialHeight = 160) {
  const translateY = useRef(new Animated.Value(0)).current;
  const [isHidden, setIsHidden] = useState(false);
  const [cardHeight, setCardHeight] = useState(initialHeight);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 5,

      onPanResponderMove: (_, gestureState) => {
        const hiddenOffset = cardHeight - HANDLE_HEIGHT;

        if (gestureState.dy > 0 && !isHidden) {
          translateY.setValue(gestureState.dy);
        } else if (gestureState.dy < 0 && isHidden) {
          translateY.setValue(hiddenOffset + gestureState.dy);
        }
      },

      onPanResponderRelease: (_, gestureState) => {
        const hiddenOffset = cardHeight - HANDLE_HEIGHT;

        if (gestureState.dy > 60 && !isHidden) {
          Animated.spring(translateY, {
            toValue: hiddenOffset,
            useNativeDriver: true,
          }).start(() => setIsHidden(true));
        } else if (gestureState.dy < -60 && isHidden) {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start(() => setIsHidden(false));
        } else {
          Animated.spring(translateY, {
            toValue: isHidden ? hiddenOffset : 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return { translateY, panResponder, cardHeight, setCardHeight };
}