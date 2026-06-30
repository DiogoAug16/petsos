import { useEffect, useState } from 'react';
import { Animated, Dimensions, Keyboard, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CommentComposer } from '@/components/complaints/comments/comment-composer';

const KEYBOARD_COMPOSER_GAP = 30;

export function DetailCommentComposerBar({
  animatedStyle,
  composerState,
  composerSubmitting,
  composerVisible,
  onBlur,
  onFocus,
  onSubmit,
  styles,
}) {
  const insets = useSafeAreaInsets();
  const [keyboardBottomOffset, setKeyboardBottomOffset] = useState(0);

  useEffect(() => {
    const handleKeyboardShow = (event) => {
      const windowHeight = Dimensions.get('window').height;
      const keyboardTop = event.endCoordinates?.screenY ?? windowHeight;
      const overlap = Math.max(0, windowHeight - keyboardTop);
      const nextOffset = Math.max(0, overlap - insets.bottom);

      setKeyboardBottomOffset(
        nextOffset > 0 ? nextOffset + KEYBOARD_COMPOSER_GAP : 0,
      );
    };

    const handleKeyboardHide = () => {
      setKeyboardBottomOffset(0);
    };

    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, handleKeyboardShow);
    const hideSubscription = Keyboard.addListener(hideEvent, handleKeyboardHide);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [insets.bottom]);

  return (
    <Animated.View
      pointerEvents={composerVisible ? 'auto' : 'none'}
      style={[
        styles.detailCommentInputBar,
        { bottom: keyboardBottomOffset },
        animatedStyle,
      ]}
    >
      <CommentComposer
        key={composerState.key}
        placeholder={composerState.placeholder}
        submitting={composerSubmitting}
        initialText={composerState.initialText}
        autoFocus={composerState.isReplying}
        onSubmit={onSubmit}
        onFocus={onFocus}
        onBlur={onBlur}
        styles={styles}
      />
    </Animated.View>
  );
}
