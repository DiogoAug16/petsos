import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, TextInput, View } from 'react-native';
import { useCommentComposer } from '@/hooks/useCommentComposer';

export function CommentComposer({
  placeholder,
  submitting,
  onSubmit,
  onFocus,
  onBlur,
  initialText = '',
  autoFocus = false,
  styles,
}) {
  const { inputRef, text, setText, isEmpty, handleSubmit } = useCommentComposer({
    initialText,
    autoFocus,
    submitting,
    onSubmit,
  });

  return (
    <View style={styles.commentComposer}>
      <TextInput
        ref={inputRef}
        style={styles.commentInput}
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        placeholderTextColor="#8D7D78"
        multiline
        onFocus={onFocus}
        onBlur={onBlur}
      />

      <Pressable
        style={[
          styles.commentSendButton,
          isEmpty && styles.commentSendButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={isEmpty || submitting}
      >
        {submitting ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Ionicons name="send" size={16} color="#fff" />
        )}
      </Pressable>
    </View>
  );
}
