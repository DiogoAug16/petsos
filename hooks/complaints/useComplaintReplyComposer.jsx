import { useCallback, useMemo, useState } from 'react';

export function useComplaintReplyComposer({ addComment, handleInputFocus }) {
  const [replyTarget, setReplyTarget] = useState(null);
  const [replySubmitting, setReplySubmitting] = useState(false);

  const isReplying = Boolean(replyTarget);
  const initialText = replyTarget?.username ? `@${replyTarget.username} ` : '';
  const placeholder = replyTarget?.username
    ? `Responder @${replyTarget.username}`
    : 'Adicionar comentário...';

  const handleReplyPress = useCallback(
    (target) => {
      setReplyTarget(target);
      handleInputFocus();
    },
    [handleInputFocus],
  );

  const handleComposerSubmit = useCallback(
    async (text) => {
      if (!replyTarget?.submitReply) {
        return addComment(text);
      }

      try {
        setReplySubmitting(true);
        const reply = await replyTarget.submitReply(text);
        if (reply) {
          setReplyTarget(null);
        }
        return reply;
      } finally {
        setReplySubmitting(false);
      }
    },
    [addComment, replyTarget],
  );

  const composerState = useMemo(
    () => ({
      key: replyTarget?.targetId || 'new-comment',
      initialText,
      placeholder,
      submitting: replySubmitting,
      isReplying,
    }),
    [initialText, isReplying, placeholder, replySubmitting, replyTarget?.targetId],
  );

  return {
    replyTarget,
    composerState,
    handleReplyPress,
    handleComposerSubmit,
  };
}
