// context/ComplaintsContext.jsx
import { useComplaintsFetch } from '@/hooks/useComplaintsFetch';
import { createContext, useContext, useEffect } from 'react';

const ComplaintsContext = createContext(null);

export function ComplaintsProvider({ children }) {
  const {
    data,
    loading,
    refreshing,
    error,
    fetchComplaints,
    refresh,
    refetchSilent,
    refetch,
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
        loading,
        refreshing,
        error,
        refetch,
        refetchSilent,
        refresh,
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
