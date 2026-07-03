import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { styles } from "@/styles/complaints/evidence-validation.styles";

import { EvidenceCard } from "./evidence-card";

export const OwnerEvidenceValidation = ({
  loading,
  selectedIds,
  pendingEvidences,
  resolveUri,
  onToggleSelection,
  onSelectAll,
  onClearSelection,
  onValidate,
  onPhotoPress,
}) => {
  const hasSelection = selectedIds.length > 0;
  const allSelected =
    pendingEvidences.length > 0 && selectedIds.length === pendingEvidences.length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="shield-checkmark-outline" size={18} color="#F59E0B" />
        <Text style={styles.headerText}>Validar Evidências</Text>
      </View>
      <Text style={styles.description}>
        Selecione as evidências que deseja aprovar ou rejeitar.
      </Text>

      {pendingEvidences.length > 1 && (
        <Pressable
          style={styles.selectAllButton}
          onPress={allSelected ? onClearSelection : onSelectAll}
        >
          <Ionicons
            name={allSelected ? "checkbox" : "square-outline"}
            size={18}
            color={allSelected ? "#F59E0B" : "#78716C"}
          />
          <Text style={styles.selectAllText}>
            {allSelected ? "Desmarcar todas" : "Selecionar todas"}
          </Text>
        </Pressable>
      )}

      {pendingEvidences.map((evidence) => (
        <EvidenceCard
          key={evidence.id}
          evidence={evidence}
          selected={selectedIds.includes(evidence.id)}
          selectable
          resolveUri={resolveUri}
          onPress={() => onToggleSelection(evidence.id)}
          onPhotoPress={onPhotoPress}
        />
      ))}

      {hasSelection && (
        <Text style={styles.selectionCount}>
          {selectedIds.length} evidência{selectedIds.length > 1 ? "s" : ""}{" "}
          selecionada{selectedIds.length > 1 ? "s" : ""}
        </Text>
      )}

      <View style={styles.actions}>
        <Pressable
          style={[styles.rejectButton, (loading || !hasSelection) && { opacity: 0.5 }]}
          onPress={() => onValidate(false)}
          disabled={loading || !hasSelection}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#E24B4A" />
          ) : (
            <Text style={styles.rejectText}>Rejeitar</Text>
          )}
        </Pressable>
        <Pressable
          style={[styles.approveButton, (loading || !hasSelection) && { opacity: 0.5 }]}
          onPress={() => onValidate(true)}
          disabled={loading || !hasSelection}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.approveText}>Aprovar</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};
