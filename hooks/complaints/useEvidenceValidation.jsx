import { useCallback, useEffect, useMemo, useState } from "react";
import Toast from "react-native-toast-message";

import { DISPLAY_STATUSES } from "@/constants/complaints/complaint-evidence-validation.constants";
import { useUploadUrl } from "@/hooks/shared/useUploadUrl";
import { validateEvidence } from "@/services/complaints/complaint-evidence.service";
import { getVoteStatus, voteOnComplaint } from "@/services/complaints/complaint-votes.service";
import {
  isClosedByCommunity,
  isRejectedByCommunity,
  isResolvedByCommunity,
} from "@/utils/complaints/evidence-validation.utils";

export const useEvidenceValidation = ({
  complaint,
  isOwner,
  isVolunteer,
  isFollowing,
  evidences,
  onStatusChanged,
}) => {
  const uploadUrl = useUploadUrl();
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [voteStatus, setVoteStatus] = useState(null);
  const [voteLoading, setVoteLoading] = useState(false);
  const [fullscreenPhoto, setFullscreenPhoto] = useState(null);
  const [communityResolved, setCommunityResolved] = useState(false);
  const [communityRejected, setCommunityRejected] = useState(false);
  const [communityClosed, setCommunityClosed] = useState(false);

  const evidenceList = useMemo(() => (Array.isArray(evidences) ? evidences : []), [
    evidences,
  ]);
  const pendingEvidences = useMemo(
    () => evidenceList.filter((evidence) => !evidence.status || evidence.status === "pending"),
    [evidenceList],
  );

  const resolveUri = useCallback(
    (uri) => {
      if (!uri) return "";
      if (/^(https?:|file:)/i.test(uri)) return uri;
      if (!uploadUrl) return uri;
      const base = uploadUrl.endsWith("/") ? uploadUrl.slice(0, -1) : uploadUrl;
      const path = uri.startsWith("/") ? uri : `/${uri}`;
      return `${base}${path}`;
    },
    [uploadUrl],
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
      setCommunityClosed(false);
      setVoteStatus(null);
      return;
    }

    if (complaint?.validationRequestedAt && !isOwner && (isFollowing || isVolunteer)) {
      loadVoteStatus();
    }
  }, [
    complaint?.id,
    complaint?.status,
    complaint?.validationRequestedAt,
    isOwner,
    isFollowing,
    isVolunteer,
    loadVoteStatus,
  ]);

  const toggleSelection = useCallback((id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id],
    );
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(pendingEvidences.map((evidence) => evidence.id));
  }, [pendingEvidences]);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const handleValidate = useCallback(
    async (approved) => {
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
    },
    [complaint, onStatusChanged, selectedIds],
  );

  const handleVote = useCallback(
    async (approved) => {
      setVoteLoading(true);
      try {
        const response = await voteOnComplaint(complaint.id, approved);
        const data = response?.data || response;
        const resolvedByCommunity = isResolvedByCommunity(complaint, data, {
          allowResolvedFlag: true,
          allowStatusFlag: true,
        });
        const closedByCommunity = isClosedByCommunity(complaint, data);
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
        } else if (closedByCommunity) {
          Toast.show({
            type: "success",
            text1: "Denúncia fechada",
            text2: "Denúncia fechada pela comunidade.",
          });
          setCommunityClosed(true);
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
    },
    [complaint, loadVoteStatus, onStatusChanged],
  );

  return {
    loading,
    selectedIds,
    voteStatus,
    voteLoading,
    fullscreenPhoto,
    communityResolved,
    communityRejected,
    communityClosed,
    evidenceList,
    pendingEvidences,
    resolveUri,
    loadVoteStatus,
    toggleSelection,
    selectAll,
    clearSelection,
    handleValidate,
    handleVote,
    setFullscreenPhoto,
  };
};
