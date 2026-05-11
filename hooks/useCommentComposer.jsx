import { useCallback, useEffect, useRef, useState } from 'react';

export function useCommentComposer({
  initialText = '',
  autoFocus = false,
  submitting = false,
  onSubmit,
}) {
  const inputRef = useRef(null);
  const [text, setText] = useState(initialText);
  const isEmpty = text.trim().length === 0;
  const canSubmit = !isEmpty && !submitting;

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  useEffect(() => {
    if (!autoFocus) return undefined;

    const timer = setTimeout(() => inputRef.current?.focus(), 0);
    return () => clearTimeout(timer);
  }, [autoFocus]);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;

    const submitted = await onSubmit(text);
    if (submitted) {
      setText('');
    }
  }, [canSubmit, onSubmit, text]);

  return {
    inputRef,
    text,
    setText,
    isEmpty,
    handleSubmit,
  };
}
