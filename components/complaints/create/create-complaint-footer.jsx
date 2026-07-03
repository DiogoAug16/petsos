import { Pressable, Text, View } from 'react-native';

export function CreateComplaintFooter({
  isEdit,
  isLoadingEdit,
  isSubmitting,
  onSubmit,
  styles,
}) {
  return (
    <View style={styles.footer}>
      <Pressable
        style={[
          styles.submitButton,
          isSubmitting && styles.submitButtonDisabled,
        ]}
        onPress={onSubmit}
        disabled={isSubmitting || isLoadingEdit}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? 'Salvando...' : isEdit ? 'Salvar' : 'Publicar'}
        </Text>
      </Pressable>
    </View>
  );
}
