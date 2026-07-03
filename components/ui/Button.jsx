import Colors from '@/styles/theme/Colors';
import { useHapticPress } from '@/hooks/ui/useHapticPress';
import { useColorScheme } from '@/hooks/ui/useColorScheme';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function Button({
  title,
  onPress,
  variant = 'primary',
  style,
  textStyle,
  disabled = false,
}) {
  const theme = useColorScheme() || 'light';
  const colors = Colors[theme];
  const handlePress = useHapticPress(onPress);

  const backgroundColor = disabled
    ? '#ccc'
    : variant === 'danger'
    ? colors.danger
    : colors.primary;

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }, style]}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});
