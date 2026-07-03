import { useCallback } from 'react';

export function useMapHandlers({
  hideSuggestions,
  closeFilter,
  selectComplaint,
  toggleFilter,
  applyTypeFilter,
  clearTypeFilter,
}) {
  const handleComplaintMarkerPress = useCallback(
    (complaint) => {
      hideSuggestions();
      closeFilter();
      selectComplaint?.(complaint);
    },
    [closeFilter, hideSuggestions, selectComplaint]
  );

  const handleMapPress = useCallback(() => {
    hideSuggestions();
    closeFilter();
  }, [closeFilter, hideSuggestions]);

  const handleToggleFilter = useCallback(() => {
    hideSuggestions();
    toggleFilter();
  }, [hideSuggestions, toggleFilter]);

  const handleApplyFilter = useCallback(() => {
    applyTypeFilter();
    hideSuggestions();
  }, [applyTypeFilter, hideSuggestions]);

  const handleClearFilter = useCallback(() => {
    clearTypeFilter();
    hideSuggestions();
  }, [clearTypeFilter, hideSuggestions]);

  return {
    handleComplaintMarkerPress,
    handleMapPress,
    handleToggleFilter,
    handleApplyFilter,
    handleClearFilter,
  };
}
