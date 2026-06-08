import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

import { useUploadUrl } from '@/hooks/useUploadUrl';
import { validateEvidence } from '@/services/complaint-evidence.service';
import { getVoteStatus, voteOnComplaint } from '@/services/complaint-votes.service';

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

  const evidenceList = Array.isArray(evidencesProp) ? evidencesProp : [];
  const pendingEvidences = evidenceList.filter((e) => !e.status || e.status === 'pending');

  // Resetar state quando a reclamação muda de status
  useEffect(() => {
    if (complaint?.status !== 'aguardando_validacao') {
      setCommunityResolved(false);
      setVoteStatus(null);
    }
  }, [complaint?.id, complaint?.status]);

  const resolveUri = (uri) => {
    if (!uri) return '';
    if (/^(https?:|file:)/i.test(uri)) return uri;
    if (!uploadUrl) return uri;
    const base = uploadUrl.endsWith('/') ? uploadUrl.slice(0, -1) : uploadUrl;
    const path = uri.startsWith('/') ? uri : `/${uri}`;
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
        type: 'info',
        text1: 'Selecione evidências',
        text2: 'Toque nas evidências que deseja validar.',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await validateEvidence(complaint.id, { approved, evidenceIds: selectedIds });
      const data = response?.data || response;
      const resolvedByCommunity = data?.autoResolved || data?.resolvedBy === 'community';

      // Verificar se a tarefa foi resolvida
      if (data?.status === 'resolved') {
        Toast.show({
          type: 'success',
          text1: 'Denúncia Resolvida! 🎉',
          text2: approved
            ? resolvedByCommunity
              ? `✅ Denúncia resolvida automaticamente pela comunidade! (${data?.autoResolveThreshold ?? 1} validações atingidas)`
              : '✅ Denúncia resolvida por você!'
            : 'Evidências rejeitadas. Denúncia voltou para em andamento.',
        });

        if (resolvedByCommunity) {
          setCommunityResolved(true);
        }

        setSelectedIds([]);
        onStatusChanged?.();
      } else {
        Toast.show({
          type: 'success',
          text1: approved ? 'Evidências aprovadas' : 'Evidências rejeitadas',
          text2: approved
            ? 'Denúncia marcada como resolvida.'
            : data?.hasPending
              ? 'Ainda há evidências pendentes.'
              : 'Denúncia voltou para em andamento.',
        });
        setSelectedIds([]);
        onStatusChanged?.();
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: err?.message || 'Não foi possível validar.',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadVoteStatus = async () => {
    try {
      const response = await getVoteStatus(complaint.id);
      setVoteStatus(response?.data || response);
    } catch {
      setVoteStatus(null);
    }
  };

  const handleVote = async (approved) => {
    setVoteLoading(true);
    try {
      const response = await voteOnComplaint(complaint.id, approved);
      const data = response?.data || response;

      // Verificar se a tarefa foi resolvida pela comunidade
      if (data?.status === 'resolved' && data?.resolvedBy === 'community') {
        setCommunityResolved(true);
        Toast.show({
          type: 'success',
          text1: 'Denúncia Resolvida! 🎉',
          text2: 'Sua validação atingiu o limite e a tarefa foi marcada como resolvida pela comunidade.',
        });
        // Recarregar os dados da denúncia
        onStatusChanged?.();
      } else {
        Toast.show({
          type: 'success',
          text1: 'Voto registrado',
          text2: data?.resolved || data?.validationCount >= 5
            ? 'Denúncia resolvida pela comunidade.'
            : 'Seu voto foi contabilizado.',
        });

        if (data?.resolved || data?.validationCount >= 5) {
          onStatusChanged?.();
        } else {
          await loadVoteStatus();
        }
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: err?.message || 'Não foi possível votar.',
      });
    } finally {
      setVoteLoading(false);
    }
  };

  if (isOwner && complaint?.status === 'aguardando_validacao') {
    const hasSelection = selectedIds.length > 0;
    const allSelected = pendingEvidences.length > 0 && selectedIds.length === pendingEvidences.length;

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
            <Pressable style={styles.selectAllButton} onPress={allSelected ? () => setSelectedIds([]) : selectAll}>
              <Ionicons
                name={allSelected ? 'checkbox' : 'square-outline'}
                size={18}
                color={allSelected ? '#F59E0B' : '#78716C'}
              />
              <Text style={styles.selectAllText}>
                {allSelected ? 'Desmarcar todas' : 'Selecionar todas'}
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
                    name={isSelected ? 'checkbox' : 'square-outline'}
                    size={20}
                    color={isSelected ? '#F59E0B' : '#A8A29E'}
                  />
                  <Text style={styles.evidenceAuthor}>
                    @{evidence.username || 'anônimo'}
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
              {selectedIds.length} evidência{selectedIds.length > 1 ? 's' : ''} selecionada{selectedIds.length > 1 ? 's' : ''}
            </Text>
          )}

          <View style={styles.actions}>
            <Pressable
              style={[styles.rejectButton, (loading || !hasSelection) && { opacity: 0.5 }]}
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
              style={[styles.approveButton, (loading || !hasSelection) && { opacity: 0.5 }]}
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

  if (!isFollowing && !isVolunteer) return null;

  // Se foi resolvido pela comunidade, mostrar mensagem de sucesso
  if (
    communityResolved ||
    ((complaint?.status === 'resolved' || complaint?.status === 'resolvido') && complaint?.resolvedBy === 'community')
  ) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="checkmark-circle" size={18} color="#10B981" />
          <Text style={styles.headerText}>Resolvido pela Comunidade</Text>
        </View>
        <Text style={styles.description}>
          Esta tarefa foi marcada como resolvida através da validação comunitária.
        </Text>
        <View style={styles.resolvedSuccessContainer}>
          <Ionicons name="checkmark" size={32} color="#10B981" />
          <Text style={styles.resolvedSuccessText}>Tarefa concluída!</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="people-outline" size={18} color="#F59E0B" />
        <Text style={styles.headerText}>Votação da Comunidade</Text>
      </View>
      <Text style={styles.description}>
        Se o criador não validar em 7 dias, a comunidade pode votar para resolver.
      </Text>

      {voteStatus === null ? (
        <Pressable style={styles.loadVoteButton} onPress={loadVoteStatus}>
          <Text style={styles.loadVoteText}>Verificar votação</Text>
        </Pressable>
      ) : !voteStatus.votingEnabled ? (
        <Text style={styles.voteDisabled}>
          Votação será liberada após 7 dias sem resposta do criador.
        </Text>
      ) : voteStatus.hasVoted ? (
        <Text style={styles.votedText}>
          Você já votou. {voteStatus.votes?.approved || voteStatus.votes}/{voteStatus.threshold} votos para resolver.
        </Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 14,
    borderWidth: 0.5,
    borderColor: '#F59E0B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
  },
  description: {
    fontSize: 13,
    color: '#78716C',
    lineHeight: 18,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  rejectButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E24B4A',
    alignItems: 'center',
  },
  rejectText: {
    color: '#E24B4A',
    fontWeight: '700',
    fontSize: 13,
  },
  approveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#10B981',
    alignItems: 'center',
  },
  approveText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  loadVoteButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  loadVoteText: {
    color: '#F59E0B',
    fontWeight: '600',
    fontSize: 13,
  },
  voteDisabled: {
    fontSize: 12,
    color: '#8A8A8E',
    fontStyle: 'italic',
  },
  votedText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
  },
  selectAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  selectAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#78716C',
  },
  evidenceCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  evidenceCardSelected: {
    borderColor: '#F59E0B',
    backgroundColor: '#FEF9C3',
  },
  evidenceCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  evidenceAuthor: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },
  selectionCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 10,
    textAlign: 'center',
  },
  evidenceDescription: {
    fontSize: 13,
    color: '#1C1C1E',
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
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenClose: {
    position: 'absolute',
    top: 56,
    right: 16,
    zIndex: 10,
  },
  fullscreenImage: {
    width: '100%',
    height: '80%',
  },
  resolvedSuccessContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#ECFDF5',
    borderRadius: 10,
    marginTop: 12,
  },
  resolvedSuccessText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
    marginTop: 8,
  },
});
