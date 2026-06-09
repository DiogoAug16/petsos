import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import { requestComplaintValidation } from "@/services/complaints.service";

const ALLOWED_STATUSES = ["aberto", "em_andamento", "aguardando_validacao"];

const REASONS = [
  {
    type: "already_resolved",
    label: "Denúncia já resolvida",
  },
  {
    type: "false_report",
    label: "Denúncia falsa",
  },
  {
    type: "needs_community_review",
    label: "Precisa de revisão da comunidade",
  },
];

export function RequestValidationButton({ complaint, isVolunteer, onRequested }) {
  const [visible, setVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState(REASONS[0].type);
  const [reasonText, setReasonText] = useState("");
  const [loading, setLoading] = useState(false);

  if (!complaint || !isVolunteer || !ALLOWED_STATUSES.includes(complaint.status)) {
    return null;
  }

  const alreadyRequested = Boolean(complaint.validationRequestedAt);
  const selectedLabel = REASONS.find((reason) => reason.type === selectedReason)?.label;

  if (alreadyRequested) return null;

  const handleSubmit = async () => {
    if (loading || alreadyRequested) return;

    setLoading(true);
    try {
      await requestComplaintValidation(complaint.id, {
        reasonType: selectedReason,
        reasonText: reasonText.trim() || null,
      });

      Toast.show({
        type: "success",
        text1: "Votação solicitada à comunidade",
      });

      setVisible(false);
      setReasonText("");
      onRequested?.();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro ao solicitar votação",
        text2: error?.message || "Não foi possível abrir a votação.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="people-circle-outline" size={20} color="#92400E" />
          <Text style={styles.title}>Votação da comunidade</Text>
        </View>

        <Text style={styles.description}>
          Abra uma votação para seguidores e voluntários revisarem esta denúncia.
        </Text>
        <Pressable style={styles.button} onPress={() => setVisible(true)}>
          <Text style={styles.buttonText}>Solicitar votação</Text>
        </Pressable>
      </View>

      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.card}>
            <Text style={styles.modalTitle}>Solicitar votação</Text>
            <Text style={styles.modalDescription}>
              Escolha por que a comunidade deve revisar esta denúncia.
            </Text>

            {REASONS.map((reason) => {
              const selected = reason.type === selectedReason;
              return (
                <Pressable
                  key={reason.type}
                  style={[styles.reasonOption, selected && styles.reasonOptionSelected]}
                  onPress={() => setSelectedReason(reason.type)}
                  disabled={loading}
                >
                  <Ionicons
                    name={selected ? "radio-button-on" : "radio-button-off"}
                    size={18}
                    color={selected ? "#F59E0B" : "#78716C"}
                  />
                  <Text style={styles.reasonOptionText}>{reason.label}</Text>
                </Pressable>
              );
            })}

            <TextInput
              value={reasonText}
              onChangeText={setReasonText}
              placeholder={`Detalhe o motivo: ${selectedLabel}`}
              placeholderTextColor="#A8A29E"
              multiline
              maxLength={500}
              editable={!loading}
              style={styles.input}
            />

            <View style={styles.actions}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setVisible(false)}
                disabled={loading}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={[styles.confirmButton, loading && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.confirmText}>Solicitar</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    padding: 14,
    borderWidth: 0.5,
    borderColor: "#F59E0B",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  title: {
    color: "#92400E",
    fontSize: 14,
    fontWeight: "700",
  },
  description: {
    color: "#78716C",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  reason: {
    color: "#57534E",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 2,
  },
  reasonText: {
    color: "#78716C",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#F59E0B",
    borderRadius: 10,
    paddingVertical: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "800",
  },
  backdrop: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    width: "100%",
  },
  modalTitle: {
    color: "#1C1C1E",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },
  modalDescription: {
    color: "#78716C",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  reasonOption: {
    alignItems: "center",
    borderColor: "#E7E5E4",
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
    padding: 12,
  },
  reasonOptionSelected: {
    backgroundColor: "#FFFBEB",
    borderColor: "#F59E0B",
  },
  reasonOptionText: {
    color: "#44403C",
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
  },
  input: {
    borderColor: "#E7E5E4",
    borderRadius: 10,
    borderWidth: 1,
    color: "#292524",
    fontSize: 13,
    minHeight: 92,
    padding: 12,
    textAlignVertical: "top",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  cancelButton: {
    alignItems: "center",
    borderColor: "#D6D3D1",
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 12,
  },
  cancelText: {
    color: "#57534E",
    fontSize: 13,
    fontWeight: "700",
  },
  confirmButton: {
    alignItems: "center",
    backgroundColor: "#F59E0B",
    borderRadius: 10,
    flex: 1,
    paddingVertical: 12,
  },
  confirmText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "800",
  },
  disabledButton: {
    opacity: 0.7,
  },
});
