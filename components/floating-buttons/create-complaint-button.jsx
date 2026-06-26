import { useRequireAuth } from '@/context/AuthPromptContext';
import { useHaptics } from '@/hooks/ui/useHaptics.jsx';
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
        title: 'Entre para criar uma denúncia',
        message:
          'Faça login ou crie uma conta para registrar uma denúncia.',
      },
    );
  };

  return (
    <TouchableOpacity style={style} onPress={handlePress}>
      <Ionicons name="add" size={28} color="#fff" />
    </TouchableOpacity>
  );
}
