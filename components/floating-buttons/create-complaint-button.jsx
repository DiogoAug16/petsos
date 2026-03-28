import { useHaptics } from '@/hooks/useHaptics.jsx';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

export function FabButton({ style, onPress }) {
  const { triggerHaptics } = useHaptics();

  const handlePress = () => {
    triggerHaptics("normal");
    onPress?.();
  };

  return (
    <TouchableOpacity style={style} onPress={handlePress}>
      <Ionicons name="add" size={28} color="#fff" />
    </TouchableOpacity>
  );
}