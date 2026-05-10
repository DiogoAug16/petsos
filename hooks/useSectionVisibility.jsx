import { useCallback, useRef, useState } from 'react';

export function useSectionVisibility({ showOffset = 80, hideOffset = 140 } = {}) {
  const viewportHeightRef = useRef(0);
  const scrollYRef = useRef(0);
  const sectionFrameRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const refreshVisibility = useCallback(() => {
    const viewportHeight = viewportHeightRef.current;
    const scrollY = scrollYRef.current;
    const sectionFrame = sectionFrameRef.current;

    if (!viewportHeight || !sectionFrame) {
      setIsVisible(false);
      return;
    }

    const viewportTop = scrollY;
    const viewportBottom = scrollY + viewportHeight;
    const sectionTop = sectionFrame.y;
    const sectionBottom = sectionFrame.y + sectionFrame.height;
    const shouldShow =
      sectionTop < viewportBottom - showOffset && sectionBottom > viewportTop + showOffset;
    const shouldHide =
      sectionTop > viewportBottom + hideOffset || sectionBottom < viewportTop - hideOffset;

    setIsVisible((current) => {
      if (current) return !shouldHide;
      return shouldShow;
    });
  }, [hideOffset, showOffset]);

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

  return {
    isVisible,
    handleViewportLayout,
    handleScroll,
    handleSectionLayout,
  };
}
