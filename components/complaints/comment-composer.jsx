import { Ionicons } from '@expo/vector-icons';
import { Pressable, TextInput, View } from 'react-native';
import { useState } from 'react';

export function CommentComposer({
  placeholder,
  submitting,
  onSubmit,
  styles,
}) {
  const [text, setText] = useState('');
  const canSubmit = text.trim().length > 0 && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    const submitted = await onSubmit(text);
    if (submitted) {
      setText('');
    }
  };

  return (
    <View style={styles.commentComposer}>
      <TextInput
        style={styles.commentInput}
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        placeholderTextColor="#8A8A8E"
        multiline
      />

      <Pressable
        style={[
          styles.commentSendButton,
          !canSubmit && styles.commentSendButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={!canSubmit}
      >
        <Ionicons name="send" size={16} color="#fff" />
      </Pressable>
    </View>
  );
}
