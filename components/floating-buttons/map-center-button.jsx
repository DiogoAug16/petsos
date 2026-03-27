import { mapScreenStyles } from '@/components/styles/mapScreen.styles.jsx';
import { useColorScheme } from '@/components/useColorScheme.jsx';
import { useHaptics } from '@/hooks/useHaptics.jsx';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

export function CenterButton({ onPress }) {
  const colorScheme = useColorScheme() ?? 'light';
  const styles = mapScreenStyles(colorScheme);
  const { triggerHaptics } = useHaptics();

  const handlePress = () => {
    triggerHaptics("normal");
    onPress?.();
  };

  return (
    <TouchableOpacity style={styles.centerBtn} onPress={handlePress}>
      <Ionicons name="locate-outline" size={22} color="#FF6B35" />
    </TouchableOpacity>
  );
}