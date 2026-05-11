import { Animated, Keyboard } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';

export function useCommentComposerVisibility({
  showOffset = 12,
  hideOffset = 4,
} = {}) {
  const viewportHeightRef = useRef(0);
  const scrollYRef = useRef(0);
  const sectionFrameRef = useRef(null);
  const anchorFrameRef = useRef(null);
  const inputFocusedRef = useRef(false);
  const keyboardVisibleRef = useRef(false);
  const visibleRef = useRef(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;
  const [isVisible, setIsVisible] = useState(false);

  const applyVisibility = useCallback(
    (nextVisible) => {
      if (visibleRef.current === nextVisible) return;

      visibleRef.current = nextVisible;
      setIsVisible(nextVisible);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: nextVisible ? 1 : 0,
          duration: nextVisible ? 160 : 220,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: nextVisible ? 0 : 24,
          duration: nextVisible ? 160 : 220,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [opacity, translateY],
  );

  const refreshVisibility = useCallback(() => {
    const shouldKeepVisible = inputFocusedRef.current || keyboardVisibleRef.current;

    if (shouldKeepVisible) {
      applyVisibility(true);
      return;
    }

    const viewportHeight = viewportHeightRef.current;
    const scrollY = scrollYRef.current;
    const sectionFrame = sectionFrameRef.current;
    const anchorFrame = anchorFrameRef.current;

    if (!viewportHeight || !sectionFrame || !anchorFrame) {
      applyVisibility(false);
      return;
    }

    const viewportTop = scrollY;
    const viewportBottom = scrollY + viewportHeight;
    const sectionTop = sectionFrame.y;
    const sectionBottom = sectionTop + sectionFrame.height;
    const anchorTop = sectionTop + anchorFrame.y;
    const anchorReached = viewportBottom >= anchorTop + showOffset;
    const scrolledAboveAnchor = viewportBottom < anchorTop + hideOffset;
    const sectionStillVisible =
      viewportBottom > sectionTop + showOffset && viewportTop < sectionBottom - hideOffset;

    if (visibleRef.current && scrolledAboveAnchor) {
      applyVisibility(false);
      return;
    }

    applyVisibility(anchorReached && sectionStillVisible);
  }, [applyVisibility, hideOffset, showOffset]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      keyboardVisibleRef.current = true;
      refreshVisibility();
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      keyboardVisibleRef.current = false;
      refreshVisibility();
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [refreshVisibility]);

  const handleViewportLayout = useCallback(
    (event) => {
      viewportHeightRef.current = event.nativeEvent.layout.height;
      refreshVisibility();
    },
    [refreshVisibility],
  );

  const handleScroll = useCallback(
    (event) => {
      scrollYRef.current = event.nativeEvent.contentOffset.y;
      refreshVisibility();
    },
    [refreshVisibility],
  );

  const handleSectionLayout = useCallback(
    (event) => {
      sectionFrameRef.current = event.nativeEvent.layout;
      refreshVisibility();
    },
    [refreshVisibility],
  );

  const handleComposerAnchorLayout = useCallback(
    (event) => {
      anchorFrameRef.current = event.nativeEvent.layout;
      refreshVisibility();
    },
    [refreshVisibility],
  );

  const handleInputFocus = useCallback(() => {
    inputFocusedRef.current = true;
    applyVisibility(true);
  }, [applyVisibility]);

  const handleInputBlur = useCallback(() => {
    inputFocusedRef.current = false;
    refreshVisibility();
  }, [refreshVisibility]);

  return {
    isVisible,
    animatedStyle: {
      opacity,
      transform: [{ translateY }],
    },
    handleViewportLayout,
    handleScroll,
    handleSectionLayout,
    handleComposerAnchorLayout,
    handleInputFocus,
    handleInputBlur,
  };
}
