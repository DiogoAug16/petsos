import { COMPLAINT_TYPES } from '@/constants/complaints.constants';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';

const VALID_TYPES_SET = new Set(
  COMPLAINT_TYPES.map((item) => String(item.value).trim().toLowerCase())
);

const parseType = (value) => {
  const raw = Array.isArray(value) ? value[0] : value;
  const normalized = String(raw || '').trim().toLowerCase();

  return VALID_TYPES_SET.has(normalized) ? normalized : null;
};

export function useMapTypeFilter(complaints = []) {
  const router = useRouter();
  const { type } = useLocalSearchParams();

  const queryType = useMemo(() => parseType(type), [type]);

  const [selectedType, setSelectedType] = useState(queryType);
  const [appliedType, setAppliedType] = useState(queryType);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    setSelectedType(queryType);
    setAppliedType(queryType);
  }, [queryType]);

  const filteredComplaints = useMemo(() => {
    if (!appliedType) return complaints;

    return complaints.filter((complaint) => {
      const complaintType = String(complaint?.type || '').trim().toLowerCase();
      return complaintType === appliedType;
    });
  }, [appliedType, complaints]);

  const applyTypeFilter = useCallback(() => {
    const validType = parseType(selectedType);

    setAppliedType(validType);
    setIsFilterOpen(false);
    router.setParams({ type: validType || undefined });
  }, [router, selectedType]);

  const clearTypeFilter = useCallback(() => {
    setSelectedType(null);
    setAppliedType(null);
    setIsFilterOpen(false);
    router.setParams({ type: undefined });
  }, [router]);

  const toggleFilter = useCallback(() => {
    setIsFilterOpen((current) => !current);
  }, []);

  const closeFilter = useCallback(() => {
    setIsFilterOpen(false);
  }, []);

  return {
    selectedType,
    appliedType,
    isFilterOpen,
    filteredComplaints,
    hasNoFilteredResults: filteredComplaints.length === 0,
    setSelectedType,
    applyTypeFilter,
    clearTypeFilter,
    toggleFilter,
    closeFilter,
  };
}
