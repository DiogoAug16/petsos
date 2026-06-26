// context/ComplaintsContext.jsx
import { useComplaintsFetch } from '@/hooks/complaints/useComplaintsFetch';
import { createContext, useContext, useEffect } from 'react';

const ComplaintsContext = createContext(null);

export function ComplaintsProvider({ children }) {
  const {
    data,
    pageInfo,
    loading,
    loadingMore,
    refreshing,
    error,
    fetchComplaints,
    refresh,
    refetchSilent,
    refetch,
    loadMore,
  } = useComplaintsFetch();

  useEffect(() => {
    if (typeof AbortController !== 'undefined') {
      const controller = new AbortController();
      fetchComplaints(controller.signal);
      return () => controller.abort();
    } else {
      fetchComplaints();
    }
  }, [fetchComplaints]);

  return (
    <ComplaintsContext.Provider
      value={{
        data,
        complaints: data,
        pageInfo,
        loading,
        loadingMore,
        refreshing,
        error,
        refetch,
        refetchSilent,
        refresh,
        loadMore,
      }}
    >
      {children}
    </ComplaintsContext.Provider>
  );
}

export function useComplaints() {
  const context = useContext(ComplaintsContext);
  if (!context) {
    throw new Error('useComplaints deve ser usado dentro de ComplaintsProvider');
  }
  return context;
}
