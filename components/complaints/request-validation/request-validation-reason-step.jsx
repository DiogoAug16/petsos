import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import { REQUEST_VALIDATION_REASONS } from '@/constants/complaints/complaint-request-validation.constants';

export function RequestValidationReasonStep({
  hasPendingEvidences,
  loading,
  reasonText,
  selectedLabel,
  selectedReason,
  onCancel,
  onChangeReasonText,
  onNext,
  onSelectReason,
  styles,
}) {
  return (
    <>
      <Text style={styles.modalTitle}>Solicitar votação</Text>
      <Text style={styles.modalDescription}>
        Escolha por que a comunidade deve revisar esta denúncia.
      </Text>

      {REQUEST_VALIDATION_REASONS.map((reason) => {
        const selected = reason.type === selectedReason;
        const isDisabled =
          loading ||
          (reason.type === 'evidence_selection' && !hasPendingEvidences);

        return (
          <Pressable
            key={reason.type}
            style={[
              styles.reasonOption,
              selected && styles.reasonOptionSelected,
              isDisabled && styles.reasonOptionDisabled,
            ]}
            onPress={() => onSelectReason(reason.type)}
            disabled={isDisabled}
          >
            <Ionicons
              name={selected ? 'radio-button-on' : 'radio-button-off'}
              size={18}
              color={isDisabled ? '#D6D3D1' : selected ? '#F59E0B' : '#78716C'}
            />
            <Text
              style={[
                styles.reasonOptionText,
                isDisabled && styles.reasonOptionTextDisabled,
              ]}
            >
              {reason.label}
            </Text>
            {reason.type === 'evidence_selection' && !hasPendingEvidences && (
              <Text style={styles.reasonOptionHint}>Sem evidências</Text>
            )}
          </Pressable>
        );
      })}

      <TextInput
        value={reasonText}
        onChangeText={onChangeReasonText}
        placeholder={`Detalhe o motivo: ${selectedLabel}`}
        placeholderTextColor="#A8A29E"
        multiline
        maxLength={500}
        editable={!loading}
        style={styles.input}
      />

      <View style={styles.actions}>
        <Pressable style={styles.cancelButton} onPress={onCancel} disabled={loading}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </Pressable>

        <Pressable
          style={[styles.confirmButton, loading && styles.disabledButton]}
          onPress={onNext}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.confirmText}>
              {selectedReason === 'evidence_selection' ? 'Próximo' : 'Solicitar'}
            </Text>
          )}
        </Pressable>
      </View>
    </>
  );
}
