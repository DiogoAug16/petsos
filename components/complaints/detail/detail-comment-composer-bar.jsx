import { Animated } from 'react-native';

import { CommentComposer } from '@/components/complaints/comments/comment-composer';

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
  return (
    <Animated.View
      pointerEvents={composerVisible ? 'auto' : 'none'}
      style={[styles.detailCommentInputBar, animatedStyle]}
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
