import { View, Text, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { authInputStyles as styles } from '@/styles/auth';

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
  ...props
}) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={[styles.label, { color: colors.tabIconDefault }]}>{label}</Text>
      <View style={styles.inputWrapper}>
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
      </View>
      {error && <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>}
    </View>
  );
}
