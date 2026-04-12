import Colors from '@/styles/theme/Colors';
import { StyleSheet, Text, TouchableOpacity, useColorScheme } from 'react-native';

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

  const backgroundColor = disabled
    ? '#ccc'
    : variant === 'danger'
    ? colors.danger
    : colors.primary;

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }, style]}
      onPress={onPress}
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