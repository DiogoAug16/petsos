import { useCallback, useMemo, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';

const SORT_COLLAPSED_WIDTH = 30;
const SORT_EXPANDED_WIDTH = 125;

export function useSortOrderButtonAnimation(sortOrder, onSortPress) {
  const sortAnimation = useRef(new Animated.Value(0)).current;
  const [animatedOrderLabel, setAnimatedOrderLabel] = useState(null);

  const effectiveSortOrder = animatedOrderLabel ?? sortOrder;
  const sortIcon = effectiveSortOrder === 'asc' ? 'arrow-up-outline' : 'arrow-down-outline';
  const sortLabel = effectiveSortOrder === 'asc' ? 'Crescente' : 'Decrescente';

  const sortWidth = useMemo(
    () =>
      sortAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [SORT_COLLAPSED_WIDTH, SORT_EXPANDED_WIDTH],
      }),
    [sortAnimation]
  );

  const sortLabelWidth = useMemo(
    () =>
      sortAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 92],
      }),
    [sortAnimation]
  );

  const sortLabelOpacity = useMemo(
    () =>
      sortAnimation.interpolate({
        inputRange: [0, 0.2, 1],
        outputRange: [0, 0.5, 1],
      }),
    [sortAnimation]
  );

  const handleSortPress = useCallback(() => {
    const nextSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setAnimatedOrderLabel(nextSortOrder);
    onSortPress?.();

    sortAnimation.stopAnimation();
    sortAnimation.setValue(0);

    Animated.sequence([
      Animated.timing(sortAnimation, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.delay(900),
      Animated.timing(sortAnimation, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start(() => setAnimatedOrderLabel(null));
  }, [onSortPress, sortAnimation, sortOrder]);

  return {
    effectiveSortOrder,
    sortIcon,
    sortLabel,
    sortWidth,
    sortLabelWidth,
    sortLabelOpacity,
    handleSortPress,
  };
}
