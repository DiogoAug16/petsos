import { useHaptics } from '@/hooks/useHaptics.jsx';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

export function CenterButton({ style, onPress }) {
  const { triggerHaptics } = useHaptics();

  const handlePress = () => {
    triggerHaptics("normal");
    onPress?.();
  };

  return (
    <TouchableOpacity style={style} onPress={handlePress}>
      <Ionicons name="locate-outline" size={22} color="#FF6B35" />
    </TouchableOpacity>
  );
}