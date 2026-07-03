export const isResolvedByCommunity = (
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
      (complaint?.resolvedBy === "community" ||
        complaint?.resolvedBy === "community_evidence_vote"))
  );
};

export const isClosedByCommunity = (complaint, responseData) => {
  return (
    responseData?.closed === true ||
    responseData?.closedBy === "community" ||
    ((complaint?.status === "fechado" || complaint?.status === "closed") &&
      complaint?.closedBy === "community")
  );
};

export const isRejectedByCommunity = (complaint, responseData) => {
  return (
    responseData?.rejected === true ||
    responseData?.rejectedBy === "community" ||
    complaint?.rejectedBy === "community"
  );
};

export const formatPercent = (value) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return "0%";
  return `${Math.round(numericValue * 100)}%`;
};
