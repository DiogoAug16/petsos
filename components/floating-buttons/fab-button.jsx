import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { mapScreenStyles } from '@/components/styles/mapScreen.styles.jsx';
import { useColorScheme } from '@/components/useColorScheme.jsx';
import { useHaptics } from '@/hooks/useHaptics.jsx';

export function FabButton({ onPress }) {
  const colorScheme = useColorScheme() ?? 'light';
  const styles = mapScreenStyles(colorScheme);
  const { triggerHaptics } = useHaptics();

  const handlePress = () => {
    triggerHaptics("normal");
    onPress?.();
  };

  return (
    <TouchableOpacity style={styles.fab} onPress={handlePress}>
      <Ionicons name="add" size={28} color="#fff" />
    </TouchableOpacity>
  );
}