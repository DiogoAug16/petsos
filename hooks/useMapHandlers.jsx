import { useCallback } from 'react';

export function useMapHandlers({
  router,
  hideSuggestions,
  closeFilter,
  toggleFilter,
  applyTypeFilter,
  clearTypeFilter,
}) {
  const handleComplaintMarkerPress = useCallback(
    (complaintRouteId) => {
      if (complaintRouteId) {
        router.push(`/complaint/${complaintRouteId}`);
      }
    },
    [router]
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
