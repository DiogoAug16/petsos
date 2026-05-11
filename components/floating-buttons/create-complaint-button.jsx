import { useHaptics } from '@/hooks/useHaptics.jsx';
import { useRequireAuth } from '@/context/AuthPromptContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export function FabButton({ style, onPress }) {
  const { triggerHaptics } = useHaptics();
  const router = useRouter();
  const requireAuth = useRequireAuth();

  const handlePress = () => {
    requireAuth(
      () => {
        triggerHaptics('normal');
        onPress?.();
        router.push('/complaint/create');
      },
      {
        title: 'Entre para criar uma denuncia',
        message:
          'Faca login ou crie uma conta para registrar uma denuncia.',
      },
    );
  };

  return (
    <TouchableOpacity style={style} onPress={handlePress}>
      <Ionicons name="add" size={28} color="#fff" />
    </TouchableOpacity>
  );
}
