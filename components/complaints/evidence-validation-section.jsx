import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import { useUploadUrl } from "@/hooks/useUploadUrl";
import { validateEvidence } from "@/services/complaint-evidence.service";
import { getVoteStatus, voteOnComplaint } from "@/services/complaint-votes.service";

const VALIDATION_STATUSES = ["awaiting_validation", "aguardando_validacao"];
const DISPLAY_STATUSES = [...VALIDATION_STATUSES, "resolved", "resolvido", "fechado", "closed"];

const REQUEST_REASON_LABELS = {
  already_resolved: "Denúncia já resolvida",
  false_report: "Denúncia falsa",
  needs_community_review: "Precisa de revisão da comunidade",
  evidence_selection: "Selecionar evidências para resolução",
  owner_inactive: "Autor não respondeu em 7 dias",
};

const isResolvedByCommunity = (
  complaint,
  responseData,
  { allowResolvedFlag, allowStatusFlag } = {},
) => {
  return (
    (allowResolvedFlag && responseData?.resolved === true) ||
    (allowStatusFlag &&
      (responseData?.status === "resolved" || responseData?.status === "resolvido")) ||
    responseData?.resolvedBy === "community" ||
    responseData?.resolvedBy === "community_evidence_vote" ||
    ((complaint?.status === "resolved" || complaint?.status === "resolvido") &&
      (complaint?.resolvedBy === "community" || complaint?.resolvedBy === "community_evidence_vote"))
  );
};

const isRejectedByCommunity = (complaint, responseData) => {
  return (
    responseData?.rejected === true ||
    responseData?.rejectedBy === "community" ||
    complaint?.rejectedBy === "community"
  );
};

const formatPercent = (value) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return "0%";
  return `${Math.round(numericValue * 100)}%`;
};

export function EvidenceValidationSection({
  complaint,
  isOwner,
  isVolunteer,
  isFollowing,
  evidences: evidencesProp,
  onStatusChanged,
}) {
  const uploadUrl = useUploadUrl();
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [voteStatus, setVoteStatus] = useState(null);
  const [voteLoading, setVoteLoading] = useState(false);
  const [fullscreenPhoto, setFullscreenPhoto] = useState(null);
  const [communityResolved, setCommunityResolved] = useState(false);
  const [communityRejected, setCommunityRejected] = useState(false);

  const evidenceList = Array.isArray(evidencesProp) ? evidencesProp : [];
  const pendingEvidences = evidenceList.filter(
    (e) => !e.status || e.status === "pending",
  );

  const loadVoteStatus = useCallback(async () => {
    if (!complaint?.id) return;

    try {
      const response = await getVoteStatus(complaint.id);
      setVoteStatus(response?.data || response);
    } catch {
      setVoteStatus(null);
    }
  }, [complaint?.id]);


  useEffect(() => {
    if (!DISPLAY_STATUSES.includes(complaint?.status)) {
      setCommunityResolved(false);
      setCommunityRejected(false);
      setVoteStatus(null);
      return;
    }

    if (complaint?.validationRequestedAt && !isOwner) {
      loadVoteStatus();
    }
  }, [
    complaint?.id,
    complaint?.status,
    complaint?.validationRequestedAt,
    isOwner,
    loadVoteStatus,
  ]);

  if (!DISPLAY_STATUSES.includes(complaint?.status)) return null;

  const requestReason =
    REQUEST_REASON_LABELS[complaint?.validationRequestReasonType] || null;

  const resolveUri = (uri) => {
    if (!uri) return "";
    if (/^(https?:|file:)/i.test(uri)) return uri;
    if (!uploadUrl) return uri;
    const base = uploadUrl.endsWith("/") ? uploadUrl.slice(0, -1) : uploadUrl;
    const path = uri.startsWith("/") ? uri : `/${uri}`;
    return `${base}${path}`;
  };

  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const selectAll = () => {
    setSelectedIds(pendingEvidences.map((e) => e.id));
  };

  const handleValidate = async (approved) => {
    if (selectedIds.length === 0) {
      Toast.show({
        type: "info",
        text1: "Selecione evidências",
        text2: "Toque nas evidências que deseja validar.",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await validateEvidence(complaint.id, {
        approved,
        evidenceIds: selectedIds,
      });
      const data = response?.data || response;
      const resolvedByCommunity = isResolvedByCommunity(complaint, data);

      Toast.show({
        type: "success",
        text1: resolvedByCommunity
          ? "Denúncia resolvida"
          : approved
            ? "Evidências aprovadas"
            : "Evidências rejeitadas",
        text2: resolvedByCommunity
          ? "Denúncia resolvida pela comunidade."
          : approved
            ? "Denúncia marcada como resolvida."
            : data?.hasPending
              ? "Ainda há evidências pendentes."
              : "Denúncia voltou para em andamento.",
      });

      if (resolvedByCommunity) {
        setCommunityResolved(true);
      }

      setSelectedIds([]);
      onStatusChanged?.();
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: err?.message || "Não foi possível validar.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (approved) => {
    setVoteLoading(true);
    try {
      const response = await voteOnComplaint(complaint.id, approved);
      const data = response?.data || response;
      const resolvedByCommunity = isResolvedByCommunity(complaint, data, {
        allowResolvedFlag: true,
        allowStatusFlag: true,
      });
      const rejectedByCommunity = isRejectedByCommunity(complaint, data);
      const evidenceProposalRejected = data?.evidenceSelectionRejected === true;

      if (resolvedByCommunity) {
        Toast.show({
          type: "success",
          text1: "Denúncia resolvida",
          text2: "Denúncia resolvida pela comunidade.",
        });
        setCommunityResolved(true);
        onStatusChanged?.();
      } else if (evidenceProposalRejected) {
        Toast.show({
          type: "info",
          text1: "Proposta rejeitada",
          text2: "A proposta de evidências foi rejeitada. Uma nova votação pode ser aberta.",
        });
        onStatusChanged?.();
      } else if (rejectedByCommunity) {
        Toast.show({
          type: "info",
          text1: "Denúncia rejeitada",
          text2: "A comunidade rejeitou esta denúncia.",
        });
        setCommunityRejected(true);
        onStatusChanged?.();
      } else {
        Toast.show({
          type: "success",
          text1: "Voto registrado",
          text2: "Seu voto foi contabilizado.",
        });
        await loadVoteStatus();
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: err?.message || "Não foi possível votar.",
      });
    } finally {
      setVoteLoading(false);
    }
  };

  if (isOwner && VALIDATION_STATUSES.includes(complaint?.status)) {
    const hasSelection = selectedIds.length > 0;
    const allSelected =
      pendingEvidences.length > 0 && selectedIds.length === pendingEvidences.length;

    return (
      <>
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
              onPress={allSelected ? () => setSelectedIds([]) : selectAll}
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

          {pendingEvidences.map((evidence) => {
            const isSelected = selectedIds.includes(evidence.id);
            return (
              <Pressable
                key={evidence.id}
                style={[styles.evidenceCard, isSelected && styles.evidenceCardSelected]}
                onPress={() => toggleSelection(evidence.id)}
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
                <Text style={styles.evidenceDescription}>{evidence.description}</Text>
                {evidence.photos?.length > 0 && (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.evidencePhotos}
                  >
                    {evidence.photos.map((photo, i) => (
                      <Pressable
                        key={`${evidence.id}-${i}`}
                        onPress={() => setFullscreenPhoto(resolveUri(photo))}
                      >
                        <Image
                          source={{ uri: resolveUri(photo) }}
                          style={styles.evidencePhoto}
                          contentFit="cover"
                        />
                      </Pressable>
                    ))}
                  </ScrollView>
                )}
              </Pressable>
            );
          })}

          {hasSelection && (
            <Text style={styles.selectionCount}>
              {selectedIds.length} evidência{selectedIds.length > 1 ? "s" : ""}{" "}
              selecionada{selectedIds.length > 1 ? "s" : ""}
            </Text>
          )}

          <View style={styles.actions}>
            <Pressable
              style={[
                styles.rejectButton,
                (loading || !hasSelection) && { opacity: 0.5 },
              ]}
              onPress={() => handleValidate(false)}
              disabled={loading || !hasSelection}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#E24B4A" />
              ) : (
                <Text style={styles.rejectText}>Rejeitar</Text>
              )}
            </Pressable>
            <Pressable
              style={[
                styles.approveButton,
                (loading || !hasSelection) && { opacity: 0.5 },
              ]}
              onPress={() => handleValidate(true)}
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

        <Modal
          visible={!!fullscreenPhoto}
          transparent
          animationType="fade"
          onRequestClose={() => setFullscreenPhoto(null)}
        >
          <View style={styles.fullscreenBackdrop}>
            <Pressable
              style={styles.fullscreenClose}
              onPress={() => setFullscreenPhoto(null)}
            >
              <Ionicons name="close" size={28} color="#fff" />
            </Pressable>
            {fullscreenPhoto && (
              <Image
                source={{ uri: fullscreenPhoto }}
                style={styles.fullscreenImage}
                contentFit="contain"
              />
            )}
          </View>
        </Modal>
      </>
    );
  }

  if (communityResolved || isResolvedByCommunity(complaint)) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="checkmark-circle" size={18} color="#10B981" />
          <Text style={styles.headerText}>Resolvido pela Comunidade</Text>
        </View>
        <Text style={styles.description}>
          Esta denúncia foi marcada como resolvida através da votação comunitária.
        </Text>
        <View style={styles.resolvedSuccessContainer}>
          <Ionicons name="checkmark" size={32} color="#10B981" />
          <Text style={styles.resolvedSuccessText}>Denúncia concluída!</Text>
        </View>
      </View>
    );
  }

  if (communityRejected || isRejectedByCommunity(complaint)) {
    const expiresAt = voteStatus?.rejectionInfo?.rejectionExpiresAt
      || complaint?.rejectionExpiresAt;
    const expiresDate = expiresAt ? new Date(expiresAt) : null;
    const now = new Date();
    const hoursRemaining = expiresDate
      ? Math.max(0, Math.ceil((expiresDate.getTime() - now.getTime()) / (1000 * 60 * 60)))
      : null;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="close-circle" size={18} color="#E24B4A" />
          <Text style={styles.headerText}>Rejeitado pela Comunidade</Text>
        </View>
        <Text style={styles.description}>
          Esta denúncia foi rejeitada através da votação comunitária.
        </Text>
        <View style={styles.rejectedContainer}>
          <Ionicons name="close" size={32} color="#E24B4A" />
          <Text style={styles.rejectedText}>Denúncia rejeitada</Text>
        </View>
        {hoursRemaining !== null && hoursRemaining > 0 && (
          <Text style={styles.rejectionExpiryText}>
            Esta votação será removida em {hoursRemaining}h.
          </Text>
        )}
        {hoursRemaining === 0 && (
          <Text style={styles.rejectionExpiryText}>
            Esta votação será removida em breve.
          </Text>
        )}
      </View>
    );
  }

  if (!isFollowing && !isVolunteer) return null;

  if (!complaint?.validationRequestedAt) return null;

  const totalVotes =
    typeof voteStatus?.votes === "number"
      ? voteStatus.votes
      : (voteStatus?.votes?.total ?? 0);
  const quorumRequired = voteStatus?.quorumRequired ?? 0;
  const approvalRate = voteStatus?.approvalRate ?? 0;
  const rejectionRate = voteStatus?.rejectionRate ?? 0;
  const approvalRateRequired = voteStatus?.approvalRateRequired ?? 0.7;
  const rejectionRateRequired = voteStatus?.rejectionRateRequired ?? 0.7;
  const missingQuorumVotes = Math.max(quorumRequired - totalVotes, 0);
  const quorumReached = voteStatus?.quorumReached ?? totalVotes >= quorumRequired;
  const approvalRateReached = voteStatus?.approvalRateReached ?? approvalRate >= approvalRateRequired;
  const canShowVoteProgress = voteStatus !== null && voteStatus.votingEnabled;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="people-circle-outline" size={18} color="#F59E0B" />
        <Text style={styles.headerText}>Votação da comunidade</Text>
      </View>
      <Text style={styles.description}>
        Seguidores e voluntários podem votar para revisar e resolver esta denúncia.
      </Text>
      {requestReason && (
        <Text style={styles.requestReason}>Motivo da votação: {requestReason}</Text>
      )}
      {complaint.validationRequestReasonText && (
        <Text style={styles.requestReasonText}>
          {complaint.validationRequestReasonText}
        </Text>
      )}

      {voteStatus === null ? (
        <Pressable style={styles.loadVoteButton} onPress={loadVoteStatus}>
          <Text style={styles.loadVoteText}>Verificar votação</Text>
        </Pressable>
      ) : !voteStatus.votingEnabled ? (
        <Text style={styles.voteDisabled}>
          Votação será liberada após abertura por voluntário ou 7 dias sem resposta.
        </Text>
      ) : (
        <>
          {canShowVoteProgress && (
            <View style={styles.voteProgress}>
              <View>
                <View style={styles.voteProgressRow}>
                  <Text style={styles.voteProgressLabel}>Participação</Text>
                  <Text style={styles.voteProgressValue}>
                    {totalVotes}/{quorumRequired} votos necessários
                  </Text>
                </View>
                <View style={styles.progressBackground}>
                  <View
                    style={[
                      styles.participationProgressFill,
                      {
                        width: `${Math.min(
                          quorumRequired === 0 ? 0 : totalVotes / quorumRequired,
                          1,
                        ) * 100}%`,
                      },
                    ]}
                  />
                </View>
              </View>
              <View>
                <View style={styles.voteProgressRow}>
                  <Text style={styles.voteProgressLabel}>Aprovação</Text>
                  <Text style={styles.voteProgressValue}>
                    {formatPercent(approvalRate)} / {formatPercent(approvalRateRequired)}
                  </Text>
                </View>
                <View style={styles.progressBackground}>
                  <View
                    style={[
                      styles.approvalProgressFill,
                      {
                        width: `${Math.min(
                          approvalRateRequired === 0
                            ? 0
                            : approvalRate / approvalRateRequired,
                          1,
                        ) * 100}%`,
                      },
                    ]}
                  />
                </View>
              </View>
              <View>
                <View style={styles.voteProgressRow}>
                  <Text style={styles.voteProgressLabel}>Rejeição</Text>
                  <Text style={styles.voteProgressValue}>
                    {formatPercent(rejectionRate)} / {formatPercent(rejectionRateRequired)}
                  </Text>
                </View>
                <View style={styles.progressBackground}>
                  <View
                    style={[
                      styles.rejectionProgressFill,
                      {
                        width: `${Math.min(
                          rejectionRateRequired === 0
                            ? 0
                            : rejectionRate / rejectionRateRequired,
                          1,
                        ) * 100}%`,
                      },
                    ]}
                  />
                </View>
              </View>
              {!quorumReached ? (
                <Text style={styles.voteProgressHint}>
                  Ainda faltam {missingQuorumVotes} voto
                  {missingQuorumVotes === 1 ? "" : "s"} para atingir participação
                  mínima.
                </Text>
              ) : !approvalRateReached ? (
                <Text style={styles.voteProgressHint}>
                  A participação mínima foi atingida, mas a aprovação ainda está
                  abaixo de {formatPercent(approvalRateRequired)}.
                </Text>
              ) : (
                <Text style={styles.voteProgressHint}>
                  Quórum e aprovação mínima atingidos.
                </Text>
              )}
            </View>
          )}

          {voteStatus.hasVoted ? (
            <Text style={styles.votedText}>Você já votou.</Text>
          ) : (
            <View style={styles.actions}>
              <Pressable
                style={[styles.rejectButton, voteLoading && { opacity: 0.5 }]}
                onPress={() => handleVote(false)}
                disabled={voteLoading}
              >
                <Text style={styles.rejectText}>Não resolvido</Text>
              </Pressable>
              <Pressable
                style={[styles.approveButton, voteLoading && { opacity: 0.5 }]}
                onPress={() => handleVote(true)}
                disabled={voteLoading}
              >
                <Text style={styles.approveText}>Resolvido</Text>
              </Pressable>
            </View>
          )}

          {voteStatus?.reasonType === "evidence_selection" &&
            voteStatus?.proposedEvidenceIds?.length > 0 && (
            <View style={styles.evidenceSelectionSection}>
              <View style={styles.evidenceSelectionHeader}>
                <Ionicons name="documents-outline" size={16} color="#92400E" />
                <Text style={styles.evidenceSelectionTitle}>
                  Evidências propostas para resolução
                </Text>
              </View>
              <Text style={styles.evidenceSelectionDescription}>
                Um voluntário propôs estas evidências como resolução. Os botões acima
                aprovam ou rejeitam esta proposta.
              </Text>

              {pendingEvidences
                .filter((e) => voteStatus.proposedEvidenceIds.includes(e.id))
                .map((evidence) => (
                  <View key={evidence.id} style={styles.evidenceCard}>
                    <View style={styles.evidenceCardHeader}>
                      <Ionicons name="document-text-outline" size={18} color="#F59E0B" />
                      <Text style={styles.evidenceAuthor}>
                        @{evidence.username || "anônimo"}
                      </Text>
                    </View>
                    <Text style={styles.evidenceDescription}>{evidence.description}</Text>
                    {evidence.photos?.length > 0 && (
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.evidencePhotos}
                      >
                        {evidence.photos.map((photo, i) => (
                          <Pressable
                            key={`${evidence.id}-prop-${i}`}
                            onPress={() => setFullscreenPhoto(resolveUri(photo))}
                          >
                            <Image
                              source={{ uri: resolveUri(photo) }}
                              style={styles.evidencePhoto}
                              contentFit="cover"
                            />
                          </Pressable>
                        ))}
                      </ScrollView>
                    )}
                  </View>
                ))}
            </View>
          )}
        </>
      )}
    </View>
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
    gap: 6,
    marginBottom: 8,
  },
  headerText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#92400E",
  },
  description: {
    fontSize: 13,
    color: "#78716C",
    lineHeight: 18,
    marginBottom: 12,
  },
  requestReason: {
    color: "#57534E",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
  },
  requestReasonText: {
    color: "#78716C",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  rejectButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E24B4A",
    alignItems: "center",
  },
  rejectText: {
    color: "#E24B4A",
    fontWeight: "700",
    fontSize: 13,
  },
  approveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#10B981",
    alignItems: "center",
  },
  approveText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  loadVoteButton: {
    paddingVertical: 10,
    alignItems: "center",
  },
  loadVoteText: {
    color: "#F59E0B",
    fontWeight: "600",
    fontSize: 13,
  },
  voteDisabled: {
    fontSize: 12,
    color: "#8A8A8E",
    fontStyle: "italic",
  },
  voteProgress: {
    backgroundColor: "#FEF3C7",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    gap: 12,
  },
  voteProgressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  voteProgressLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#92400E",
  },
  voteProgressValue: {
    flexShrink: 1,
    textAlign: "right",
    fontSize: 12,
    fontWeight: "700",
    color: "#57534E",
  },
  voteProgressHint: {
    fontSize: 12,
    color: "#78716C",
    lineHeight: 17,
  },
  progressBackground: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#FDE68A",
    marginTop: 8,
    overflow: "hidden",
  },
  participationProgressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#F59E0B",
  },
  approvalProgressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#10B981",
  },
  rejectionProgressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#E24B4A",
  },
  votedText: {
    fontSize: 13,
    color: "#555",
    fontWeight: "500",
    marginTop: 2,
  },
  selectAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  selectAllText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#78716C",
  },
  evidenceCard: {
    backgroundColor: "#FEF3C7",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  evidenceCardSelected: {
    borderColor: "#F59E0B",
    backgroundColor: "#FEF9C3",
  },
  evidenceCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  evidenceAuthor: {
    fontSize: 12,
    fontWeight: "600",
    color: "#92400E",
  },
  selectionCount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#92400E",
    marginBottom: 10,
    textAlign: "center",
  },
  evidenceDescription: {
    fontSize: 13,
    color: "#1C1C1E",
    lineHeight: 18,
    marginBottom: 8,
  },
  evidencePhotos: {
    marginTop: 4,
  },
  evidencePhoto: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 8,
  },
  fullscreenBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenClose: {
    position: "absolute",
    top: 56,
    right: 16,
    zIndex: 10,
  },
  fullscreenImage: {
    width: "100%",
    height: "80%",
  },
  resolvedSuccessContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    backgroundColor: "#ECFDF5",
    borderRadius: 10,
    marginTop: 12,
  },
  resolvedSuccessText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#10B981",
    marginTop: 8,
  },
  rejectedContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    backgroundColor: "#FEF2F2",
    borderRadius: 10,
    marginTop: 12,
  },
  rejectedText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#E24B4A",
    marginTop: 8,
  },
  rejectionExpiryText: {
    fontSize: 12,
    color: "#78716C",
    textAlign: "center",
    marginTop: 10,
    fontStyle: "italic",
  },
  evidenceSelectionSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 0.5,
    borderTopColor: "#F59E0B",
  },
  evidenceSelectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  evidenceSelectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#92400E",
  },
  evidenceSelectionDescription: {
    fontSize: 12,
    color: "#78716C",
    lineHeight: 17,
    marginBottom: 12,
  },
});
