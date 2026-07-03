import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

export function RequestValidationEvidenceStep({
  loading,
  pendingEvidences,
  selectedEvidenceIds,
  onBack,
  onSubmit,
  onToggleEvidence,
  resolveUri,
  styles,
}) {
  return (
    <>
      <Text style={styles.modalTitle}>Selecionar evidências</Text>
      <Text style={styles.modalDescription}>
        Escolha as evidências que você propõe como resolução. A comunidade
        votará se concorda ou não.
      </Text>

      <ScrollView style={styles.evidenceScrollView}>
        {pendingEvidences.map((evidence) => {
          const isSelected = selectedEvidenceIds.includes(evidence.id);

          return (
            <Pressable
              key={evidence.id}
              style={[
                styles.evidenceCard,
                isSelected && styles.evidenceCardSelected,
              ]}
              onPress={() => onToggleEvidence(evidence.id)}
            >
              <View style={styles.evidenceCardHeader}>
                <Ionicons
                  name={isSelected ? 'checkbox' : 'square-outline'}
                  size={20}
                  color={isSelected ? '#F59E0B' : '#A8A29E'}
                />
                <Text style={styles.evidenceAuthor}>
                  @{evidence.username || 'anônimo'}
                </Text>
              </View>
              <Text style={styles.evidenceCardDescription}>
                {evidence.description}
              </Text>
              {evidence.photos?.length > 0 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.evidencePhotos}
                >
                  {evidence.photos.map((photo, index) => (
                    <Image
                      key={`${evidence.id}-${index}`}
                      source={{ uri: resolveUri(photo) }}
                      style={styles.evidencePhoto}
                      contentFit="cover"
                    />
                  ))}
                </ScrollView>
              )}
            </Pressable>
          );
        })}
      </ScrollView>

      {selectedEvidenceIds.length > 0 && (
        <Text style={styles.evidenceSelectionCount}>
          {selectedEvidenceIds.length} evidência
          {selectedEvidenceIds.length > 1 ? 's' : ''} selecionada
          {selectedEvidenceIds.length > 1 ? 's' : ''}
        </Text>
      )}

      <View style={styles.actions}>
        <Pressable style={styles.cancelButton} onPress={onBack} disabled={loading}>
          <Text style={styles.cancelText}>Voltar</Text>
        </Pressable>

        <Pressable
          style={[
            styles.confirmButton,
            (loading || selectedEvidenceIds.length === 0) && styles.disabledButton,
          ]}
          onPress={onSubmit}
          disabled={loading || selectedEvidenceIds.length === 0}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.confirmText}>Solicitar votação</Text>
          )}
        </Pressable>
      </View>
    </>
  );
}
