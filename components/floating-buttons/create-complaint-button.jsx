import { useHaptics } from '@/hooks/useHaptics.jsx';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export function FabButton({ style, onPress }) {
  const { triggerHaptics } = useHaptics();
  const router = useRouter();

  const handlePress = () => {
    triggerHaptics('normal');
    onPress?.();
    router.push('/complaint/create');
  };

  return (
    <TouchableOpacity style={style} onPress={handlePress}>
      <Ionicons name="add" size={28} color="#fff" />
    </TouchableOpacity>
  );
}