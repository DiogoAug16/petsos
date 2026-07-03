import { ActivityIndicator, Pressable, Text, View } from 'react-native';

export function EvidenceSubmitFooter({ isValid, onSubmit, submitting, styles }) {
  return (
    <View style={styles.footer}>
      <Pressable
        style={[styles.submitButton, !isValid && styles.submitButtonDisabled]}
        onPress={onSubmit}
        disabled={!isValid || submitting}
      >
        {submitting ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Enviar Evidência</Text>
        )}
      </Pressable>
    </View>
  );
}
