import { useFocusEffect } from '@react-navigation/native';
import { useComplaints } from '@/context/ComplaintsContext';
import { deleteComplaint, getComplaintById } from '@/services/complaints.service';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { useCallback, useEffect, useState } from 'react';

export function useComplaintDetail(id) {
  const router = useRouter();
  const { data: complaintsList } = useComplaints();
  const complaintFromCache = complaintsList?.find((item) => item.id === id);

  const [complaint, setComplaint] = useState(complaintFromCache ?? null);
  const [loading, setLoading] = useState(!complaintFromCache);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setError(null);

    if (complaintFromCache) {
      setComplaint(complaintFromCache);
      setLoading(false);
      return;
    }

    setComplaint(null);
    setLoading(true);
  }, [complaintFromCache, id]);

  const fetchComplaintDetails = useCallback(() => {
    if (!id) {
      setLoading(false);
      setError('Não foi possível identificar a denúncia.');
      return null;
    }

    const controller = new AbortController();
    const hasCachedComplaint = Boolean(complaintFromCache);

    if (!hasCachedComplaint) {
      setLoading(true);
    }
    setError(null);

    getComplaintById(id, controller.signal)
      .then((response) => {
        const data = response?.data || response?.complaint || response;
        setComplaint(data);
      })
      .catch((err) => {
        if (err.name !== 'AbortError' && !hasCachedComplaint) {
          setError('Não foi possível carregar os detalhes da denúncia.');
        }
      })
      .finally(() => setLoading(false));

    return controller;
  }, [complaintFromCache, id]);

  useFocusEffect(
    useCallback(() => {
      const controller = fetchComplaintDetails();
      return () => controller?.abort();
    }, [fetchComplaintDetails])
  );

  const handleEdit = useCallback(() => {
    router.push(`/complaint/create?edit=true&id=${id}`);
  }, [router, id]);

  const handleOpenMap = useCallback(() => {
    if (!complaint?.location) return;

    router.push({
      pathname: '/(tabs)',
      params: {
        focusLat: String(complaint.location.latitude),
        focusLng: String(complaint.location.longitude),
      },
    });
  }, [complaint, router]);

  const handleDelete = useCallback(async () => {
    if (isDeleting) return;

    Alert.alert(
      'Excluir denúncia',
      'Tem certeza que deseja excluir esta denúncia permanentemente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deleteComplaint(id);
              Alert.alert('Sucesso', 'Denúncia excluída com sucesso!');
              router.back();
            } catch {
              Alert.alert('Erro', 'Não foi possível excluir a denúncia.');
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  }, [id, isDeleting, router]);

  const handleStatusUpdated = useCallback((updatedComplaint) => {
    setComplaint((prev) => ({ ...prev, ...updatedComplaint }));
  }, []);

  return {
    complaint,
    loading,
    error,
    fetchComplaintDetails,
    handleEdit,
    handleOpenMap,
    handleDelete,
    handleStatusUpdated,
  };
}
