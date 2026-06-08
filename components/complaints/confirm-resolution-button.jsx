import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text } from 'react-native';
import Toast from 'react-native-toast-message';

import { confirmComplaintResolution } from '@/services/complaints.service';

export function ConfirmResolutionButton({ complaintId, onConfirmed }) {
  const [loading, setLoading] = useState(false);

  const handlePress = () => {
    Alert.alert(
      'Confirmar resolução',
      'Tem certeza que deseja marcar como resolvido?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: handleConfirm },
      ],
    );
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await confirmComplaintResolution(complaintId);

      Toast.show({
        type: 'success',
        text1: 'Denúncia marcada como resolvida',
      });

      onConfirmed?.();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao marcar denúncia como resolvida',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={loading}
      style={{
        marginHorizontal: 30,
        marginTop: 12,
        marginBottom: 24,
        backgroundColor: '#16a34a',
        borderRadius: 18,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: loading ? 0.7 : 1,
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
      }}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text
          style={{
            color: '#fff',
            fontSize: 16,
            fontWeight: '800',
          }}
        >
          Marcar como resolvido
        </Text>
      )}
    </Pressable>
  );
}