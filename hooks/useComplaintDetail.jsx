import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { deleteComplaint, getComplaintById } from '@/services/complaints.service';
import { useComplaints } from '@/context/ComplaintsContext';

export function useComplaintDetail(id) {
  const router = useRouter();
  const { data: complaintsList } = useComplaints();
  const complaintFromCache = complaintsList?.find((item) => item.id === id);
  
  const [complaint, setComplaint] = useState(complaintFromCache);
  const [loading, setLoading] = useState(!complaintFromCache);
  const [error, setError] = useState(null);
  const [isHelping, setIsHelping] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  useEffect(() => {
    if (complaintFromCache) {
      setComplaint(complaintFromCache);
      setLoading(false);
    }
  }, [complaintFromCache]);

  const fetchComplaintDetails = useCallback(() => {
    if (complaintFromCache?.description) return;

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    getComplaintById(id, controller.signal)
      .then((response) => {
        const data = response?.data || response?.complaint || response;
        setComplaint(data);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError('Não foi possível carregar os detalhes da denúncia.');
        }
      })
      .finally(() => setLoading(false));

    return controller;
  }, [id, complaintFromCache]);

  useEffect(() => {
    const controller = fetchComplaintDetails();
    return () => controller?.abort();
  }, [fetchComplaintDetails]);

  const handleToggleHelp = useCallback(() => {
    setIsHelping(!isHelping);
  }, [isHelping]);

  const handleEdit = useCallback(() => {
    Alert.alert('Funcionalidade indisponível', 'Edição de denúncia em desenvolvimento.');
  }, []);

  const handleOpenMap = useCallback((mapRef) => {
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
      'Tem a certeza que deseja excluir esta denúncia permanentemente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive', 
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deleteComplaint(id);
              router.back();
            } catch (_error) {
              Alert.alert('Erro', 'Não foi possível excluir a denúncia.');
            } finally {
              setIsDeleting(false);
            }
          }
        }
      ]
    );
  }, [id, isDeleting, router]);

  const handleShare = useCallback(() => {
    console.log('Share');
  }, []);

  const handleCloseMapModal = useCallback(() => {
    setShowMapModal(false);
  }, []);

  return {
    complaint,
    loading,
    error,
    isHelping,
    isDeleting,
    showMapModal,
    fetchComplaintDetails,
    handleToggleHelp,
    handleEdit,
    handleOpenMap,
    handleDelete,
    handleShare,
    handleCloseMapModal,
  };
}
