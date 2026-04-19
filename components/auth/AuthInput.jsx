import { Text, TextInput, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { authInputStyles as styles } from '@/styles/auth';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import { useInputAnimation } from '@/hooks/useInputAnimation';
import { useShakeAnimation } from '@/hooks/useShakeAnimation';

export default function AuthInput({
  label,
  value,
  onChangeText,
  placeholder,
  iconName,
  error,
  secureTextEntry = false,
  showToggle = false,
  onToggleSecure,
  colors,
  isDark,
  showPasswordStrength = false,
  ...props
}) {
  const { animatedStyle, glowStyle, handleFocus, handleBlur } = useInputAnimation();
  const shakeStyle = useShakeAnimation(error);

  return (
    <Animated.View style={[styles.fieldContainer, shakeStyle]}>
      <Text style={[styles.label, { color: colors.tabIconDefault }]}>{label}</Text>
      <Animated.View style={[styles.inputWrapper, animatedStyle]}>
        {/* Glow effect */}
        <Animated.View
          style={[
            styles.glowEffect,
            glowStyle,
            {
              shadowColor: colors.primary,
              backgroundColor: isDark ? colors.primary + '10' : colors.primary + '08',
            },
          ]}
        />
        <Ionicons
          name={iconName}
          size={20}
          color={colors.tabIconDefault}
          style={styles.inputIcon}
        />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.tabIconDefault}
          style={[
            styles.input,
            {
              backgroundColor: isDark ? '#1A1F2E' : '#F7F9FB',
              color: colors.text,
            },
            showToggle && styles.passwordInput,
          ]}
          secureTextEntry={secureTextEntry}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {showToggle && (
          <Pressable onPress={onToggleSecure} style={styles.eyeIcon} hitSlop={8}>
            <Ionicons
              name={secureTextEntry ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={colors.tabIconDefault}
            />
          </Pressable>
        )}
      </Animated.View>
      {showPasswordStrength && !error && (
        <PasswordStrengthIndicator password={value} colors={colors} isDark={isDark} />
      )}
      {error && <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>}
    </Animated.View>
  );
}
