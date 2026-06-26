import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { styles } from "@/styles/complaints/evidence-validation.styles";
import { formatPercent } from "@/utils/complaints/evidence-validation.utils";

import { EvidenceCard } from "./evidence-card";

const VoteProgressBar = ({ label, value, required, fillStyle }) => (
  <View>
    <View style={styles.voteProgressRow}>
      <Text style={styles.voteProgressLabel}>{label}</Text>
      <Text style={styles.voteProgressValue}>
        {formatPercent(value)} / {formatPercent(required)}
      </Text>
    </View>
    <View style={styles.progressBackground}>
      <View
        style={[
          fillStyle,
          {
            width: `${Math.min(required === 0 ? 0 : value / required, 1) * 100}%`,
          },
        ]}
      />
    </View>
  </View>
);

export const CommunityVotePanel = ({
  complaint,
  requestReason,
  voteStatus,
  voteLoading,
  pendingEvidences,
  resolveUri,
  onLoadVoteStatus,
  onVote,
  onPhotoPress,
}) => {
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
  const approvalRateReached =
    voteStatus?.approvalRateReached ?? approvalRate >= approvalRateRequired;
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
        <Pressable style={styles.loadVoteButton} onPress={onLoadVoteStatus}>
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
              <VoteProgressBar
                label="Aprovação"
                value={approvalRate}
                required={approvalRateRequired}
                fillStyle={styles.approvalProgressFill}
              />
              <VoteProgressBar
                label="Rejeição"
                value={rejectionRate}
                required={rejectionRateRequired}
                fillStyle={styles.rejectionProgressFill}
              />
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
                onPress={() => onVote(false)}
                disabled={voteLoading}
              >
                <Text style={styles.rejectText}>Não resolvido</Text>
              </Pressable>
              <Pressable
                style={[styles.approveButton, voteLoading && { opacity: 0.5 }]}
                onPress={() => onVote(true)}
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
                  .filter((evidence) => voteStatus.proposedEvidenceIds.includes(evidence.id))
                  .map((evidence) => (
                    <EvidenceCard
                      key={evidence.id}
                      evidence={evidence}
                      photoKeySuffix="prop"
                      resolveUri={resolveUri}
                      onPhotoPress={onPhotoPress}
                    />
                  ))}
              </View>
            )}
        </>
      )}
    </View>
  );
};
