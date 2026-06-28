import { useFocusEffect } from '@react-navigation/native';
import { deleteComplaint, getComplaintById } from '@/services/complaints/complaints.service';
import { useRequireVerifiedEmail } from '@/hooks/auth/useRequireVerifiedEmail';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { useCallback, useState } from 'react';

export function useComplaintDetail(id) {
  const router = useRouter();
  const requireVerifiedEmail = useRequireVerifiedEmail();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchComplaintDetails = useCallback(() => {
    if (!id) {
      setLoading(false);
      setError('Não foi possível identificar a denúncia.');
      return null;
    }

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
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      const controller = fetchComplaintDetails();
      return () => controller?.abort();
    }, [fetchComplaintDetails])
  );

  const handleEdit = useCallback(() => {
    requireVerifiedEmail(
      () => router.push(`/complaint/create?edit=true&id=${id}`),
      {
        title: 'Confirme seu email',
        message: 'Confirme seu email para editar denúncias.',
      },
    );
  }, [router, id, requireVerifiedEmail]);

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

    if (
      !requireVerifiedEmail(null, {
        title: 'Confirme seu email',
        message: 'Confirme seu email para excluir denúncias.',
      })
    ) {
      return;
    }

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
  }, [id, isDeleting, requireVerifiedEmail, router]);

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
