// context/ComplaintsContext.jsx
import { getComplaints } from '@/services/complaints.service';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const ComplaintsContext = createContext(null);

export function ComplaintsProvider({ children }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    const fetchComplaints = useCallback(async (signal) => {
    try {
        setLoading(true);
        setError(null);
        const result = await getComplaints(signal);

        setData(result);
    } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.message ?? 'Erro ao carregar denúncias');
    } finally {
        setLoading(false);
    }
    }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchComplaints(controller.signal);
    return () => controller.abort();
  }, [fetchComplaints]);

  return (
    <ComplaintsContext.Provider
      value={{
        data,
        complaints: data,
        loading,
        error,
        refetch: fetchComplaints,
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

