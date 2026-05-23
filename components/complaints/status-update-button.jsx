import { useState, useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { updateComplaintStatus } from '@/services/complaints.service';
import { STATUS_CONFIG } from '@/constants/complaints.constants';
import { StatusConfirmModal } from '@/components/complaints/status-confirm-modal';

export function StatusUpdateButton({ complaint, isOwner, onStatusUpdated, styles }) {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const statusConfig = STATUS_CONFIG[complaint?.status];
  const nextStatus = statusConfig?.nextStatus;
  const nextLabel = statusConfig?.nextLabel;

  const handleOpenModal = useCallback(() => {
    setModalVisible(true);
  }, []);

  const handleCancel = useCallback(() => {
    if (!loading) setModalVisible(false);
  }, [loading]);

  const handleConfirm = useCallback(async () => {
    if (loading || !nextStatus) return;

    setLoading(true);
    try {
      const response = await updateComplaintStatus(complaint.id, nextStatus);
      const updated = response?.data || response;

      Toast.show({
        type: 'success',
        text1: 'Status atualizado',
        text2: `Denúncia marcada como "${STATUS_CONFIG[nextStatus]?.label.replace('● ', '')}"`,
      });

      setModalVisible(false);
      onStatusUpdated?.(updated);
    } catch (err) {
      const message = err?.message || 'Não foi possível atualizar o status.';
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: message,
      });
    } finally {
      setLoading(false);
    }
  }, [complaint?.id, nextStatus, loading, onStatusUpdated]);

  if (!isOwner || !nextStatus) return null;

  return (
    <View style={styles.statusUpdateContainer}>
      <Pressable
        style={({ pressed }) => [
          styles.statusUpdateButton,
          pressed && { opacity: 0.8 },
        ]}
        onPress={handleOpenModal}
      >
        <Ionicons name="arrow-forward-circle-outline" size={18} color="#fff" />
        <Text style={styles.statusUpdateButtonText}>{nextLabel}</Text>
      </Pressable>

      <StatusConfirmModal
        visible={modalVisible}
        currentStatus={complaint.status}
        nextStatus={nextStatus}
        loading={loading}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        styles={styles}
      />
    </View>
  );
}
