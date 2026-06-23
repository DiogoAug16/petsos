import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import { useUploadUrl } from "@/hooks/useUploadUrl";
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
  {
    type: "evidence_selection",
    label: "Selecionar evidências para resolução",
  },
];

export function RequestValidationButton({ complaint, isVolunteer, onRequested, evidences }) {
  const uploadUrl = useUploadUrl();
  const [visible, setVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState(REASONS[0].type);
  const [reasonText, setReasonText] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("reason");
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState([]);

  if (!complaint || !isVolunteer || !ALLOWED_STATUSES.includes(complaint.status)) {
    return null;
  }

  const evidenceList = Array.isArray(evidences) ? evidences : [];
  const pendingEvidences = evidenceList.filter(
    (e) => !e.status || e.status === "pending",
  );
  const hasPendingEvidences = pendingEvidences.length > 0;

  const alreadyRequested = Boolean(complaint.validationRequestedAt);
  const selectedLabel = REASONS.find((reason) => reason.type === selectedReason)?.label;

  if (alreadyRequested) return null;

  const resolveUri = (uri) => {
    if (!uri) return "";
    if (/^(https?:|file:)/i.test(uri)) return uri;
    if (!uploadUrl) return uri;
    const base = uploadUrl.endsWith("/") ? uploadUrl.slice(0, -1) : uploadUrl;
    const path = uri.startsWith("/") ? uri : `/${uri}`;
    return `${base}${path}`;
  };

  const handleNext = () => {
    if (selectedReason === "evidence_selection") {
      setStep("evidence");
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (loading || alreadyRequested) return;

    if (selectedReason === "evidence_selection" && selectedEvidenceIds.length === 0) {
      Toast.show({
        type: "info",
        text1: "Selecione evidências",
        text2: "Escolha ao menos uma evidência para propor à comunidade.",
      });
      return;
    }

    setLoading(true);
    try {
      await requestComplaintValidation(complaint.id, {
        reasonType: selectedReason,
        reasonText: reasonText.trim() || null,
        evidenceIds: selectedReason === "evidence_selection" ? selectedEvidenceIds : undefined,
      });

      Toast.show({
        type: "success",
        text1: "Votação solicitada à comunidade",
      });

      setVisible(false);
      setReasonText("");
      setStep("reason");
      setSelectedEvidenceIds([]);
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
        onRequestClose={() => {
          if (step === "evidence") {
            setStep("reason");
          } else {
            setVisible(false);
          }
        }}
      >
        <View style={styles.backdrop}>
          <View style={styles.card}>
            {step === "reason" ? (
              <>
                <Text style={styles.modalTitle}>Solicitar votação</Text>
                <Text style={styles.modalDescription}>
                  Escolha por que a comunidade deve revisar esta denúncia.
                </Text>

                {REASONS.map((reason) => {
                  const selected = reason.type === selectedReason;
                  const isDisabled =
                    loading ||
                    (reason.type === "evidence_selection" && !hasPendingEvidences);
                  return (
                    <Pressable
                      key={reason.type}
                      style={[
                        styles.reasonOption,
                        selected && styles.reasonOptionSelected,
                        isDisabled && styles.reasonOptionDisabled,
                      ]}
                      onPress={() => setSelectedReason(reason.type)}
                      disabled={isDisabled}
                    >
                      <Ionicons
                        name={selected ? "radio-button-on" : "radio-button-off"}
                        size={18}
                        color={isDisabled ? "#D6D3D1" : selected ? "#F59E0B" : "#78716C"}
                      />
                      <Text
                        style={[
                          styles.reasonOptionText,
                          isDisabled && styles.reasonOptionTextDisabled,
                        ]}
                      >
                        {reason.label}
                      </Text>
                      {reason.type === "evidence_selection" && !hasPendingEvidences && (
                        <Text style={styles.reasonOptionHint}>Sem evidências</Text>
                      )}
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
                    onPress={handleNext}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.confirmText}>
                        {selectedReason === "evidence_selection" ? "Próximo" : "Solicitar"}
                      </Text>
                    )}
                  </Pressable>
                </View>
              </>
            ) : (
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
                        onPress={() =>
                          setSelectedEvidenceIds((prev) =>
                            prev.includes(evidence.id)
                              ? prev.filter((x) => x !== evidence.id)
                              : [...prev, evidence.id],
                          )
                        }
                      >
                        <View style={styles.evidenceCardHeader}>
                          <Ionicons
                            name={isSelected ? "checkbox" : "square-outline"}
                            size={20}
                            color={isSelected ? "#F59E0B" : "#A8A29E"}
                          />
                          <Text style={styles.evidenceAuthor}>
                            @{evidence.username || "anônimo"}
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
                            {evidence.photos.map((photo, i) => (
                              <Image
                                key={`${evidence.id}-${i}`}
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
                    {selectedEvidenceIds.length > 1 ? "s" : ""} selecionada
                    {selectedEvidenceIds.length > 1 ? "s" : ""}
                  </Text>
                )}

                <View style={styles.actions}>
                  <Pressable
                    style={styles.cancelButton}
                    onPress={() => setStep("reason")}
                    disabled={loading}
                  >
                    <Text style={styles.cancelText}>Voltar</Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.confirmButton,
                      (loading || selectedEvidenceIds.length === 0) && styles.disabledButton,
                    ]}
                    onPress={handleSubmit}
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
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0D8BF",
    shadowColor: "#7A3F12",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  title: {
    color: "#272A3A",
    fontSize: 15,
    fontWeight: "900",
  },
  description: {
    color: "#8D7D78",
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
    backgroundColor: "#FF8C42",
    borderRadius: 18,
    minHeight: 48,
    justifyContent: "center",
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
    borderRadius: 24,
    padding: 18,
    width: "100%",
  },
  modalTitle: {
    color: "#272A3A",
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
    borderColor: "#F0D8BF",
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
    padding: 12,
  },
  reasonOptionSelected: {
    backgroundColor: "#FFF6EC",
    borderColor: "#FF8C42",
  },
  reasonOptionText: {
    color: "#44403C",
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
  },
  reasonOptionDisabled: {
    opacity: 0.5,
  },
  reasonOptionTextDisabled: {
    color: "#A8A29E",
  },
  reasonOptionHint: {
    fontSize: 11,
    color: "#A8A29E",
    fontStyle: "italic",
  },
  input: {
    backgroundColor: "#FFF6EC",
    borderColor: "#F0D8BF",
    borderRadius: 16,
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
    borderColor: "#F0D8BF",
    borderRadius: 16,
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
    backgroundColor: "#FF8C42",
    borderRadius: 16,
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
  evidenceScrollView: {
    maxHeight: 300,
    marginBottom: 10,
  },
  evidenceCard: {
    backgroundColor: "#FFF6EC",
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F0D8BF",
  },
  evidenceCardSelected: {
    borderColor: "#FF8C42",
    backgroundColor: "#FFE8C8",
  },
  evidenceCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  evidenceAuthor: {
    fontSize: 12,
    fontWeight: "800",
    color: "#A84F16",
  },
  evidenceCardDescription: {
    fontSize: 13,
    color: "#272A3A",
    lineHeight: 18,
    marginBottom: 6,
  },
  evidencePhotos: {
    marginTop: 4,
  },
  evidencePhoto: {
    width: 74,
    height: 74,
    borderRadius: 14,
    marginRight: 6,
  },
  evidenceSelectionCount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#92400E",
    textAlign: "center",
    marginBottom: 8,
  },
});
