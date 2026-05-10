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
  const [showMapModal, setShowMapModal] = useState(false);

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

  const handleOpenMap = useCallback((mapRef) => {
    if (!complaint?.location) return;

    setShowMapModal(true);
    setTimeout(() => {
      mapRef.current?.animateToRegion({
        latitude: complaint.location.latitude,
        longitude: complaint.location.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 500);
    }, 100);
  }, [complaint]);

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

  const handleCloseMapModal = useCallback(() => {
    setShowMapModal(false);
  }, []);

  return {
    complaint,
    loading,
    error,
    showMapModal,
    fetchComplaintDetails,
    handleEdit,
    handleOpenMap,
    handleDelete,
    handleCloseMapModal,
  };
}
