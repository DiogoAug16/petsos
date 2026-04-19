import { View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AuthInput from './AuthInput';

export default function RegisterForm({
  form,
  errors,
  isSubmitting,
  showPassword,
  showConfirmPassword,
  updateField,
  handleSubmit,
  isFormValid,
  setShowPassword,
  setShowConfirmPassword,
  colors,
  isDark,
  styles,
}) {
  return (
    <View style={styles.formCard}>
      <AuthInput
        label="NOME COMPLETO"
        value={form.name}
        onChangeText={(value) => updateField('name', value)}
        placeholder="Seu nome"
        iconName="person-outline"
        error={errors.name}
        colors={colors}
        isDark={isDark}
        autoCapitalize="words"
        editable={!isSubmitting}
      />

      <AuthInput
        label="EMAIL"
        value={form.email}
        onChangeText={(value) => updateField('email', value)}
        placeholder="seu@email.com"
        iconName="mail-outline"
        error={errors.email}
        colors={colors}
        isDark={isDark}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!isSubmitting}
      />

      <AuthInput
        label="USERNAME"
        value={form.username}
        onChangeText={(value) => updateField('username', value)}
        placeholder="Seu username"
        iconName="at-outline"
        error={errors.username}
        colors={colors}
        isDark={isDark}
        autoCapitalize="none"
        autoCorrect={false}
        editable={!isSubmitting}
      />

      <AuthInput
        label="SENHA"
        value={form.password}
        onChangeText={(value) => updateField('password', value)}
        placeholder="Mínimo 8 caracteres"
        iconName="lock-closed-outline"
        error={errors.password}
        colors={colors}
        isDark={isDark}
        secureTextEntry={!showPassword}
        showToggle
        onToggleSecure={() => setShowPassword(!showPassword)}
        autoCapitalize="none"
        autoCorrect={false}
        editable={!isSubmitting}
      />

      <AuthInput
        label="CONFIRMAR SENHA"
        value={form.confirmPassword}
        onChangeText={(value) => updateField('confirmPassword', value)}
        placeholder="Digite novamente"
        iconName="lock-closed-outline"
        error={errors.confirmPassword}
        colors={colors}
        isDark={isDark}
        secureTextEntry={!showConfirmPassword}
        showToggle
        onToggleSecure={() => setShowConfirmPassword(!showConfirmPassword)}
        autoCapitalize="none"
        autoCorrect={false}
        editable={!isSubmitting}
      />

      <Pressable
        style={[
          styles.submitButton,
          (!isFormValid || isSubmitting) && styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={!isFormValid || isSubmitting}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? 'Criando conta...' : 'Criar Conta'}
        </Text>
        <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
      </Pressable>

      <View style={styles.linkContainer}>
        <Text style={styles.linkText}>Já faz parte? </Text>
        <Link href="/auth/login" asChild>
          <Pressable>
            <Text style={[styles.link, { color: colors.primary }]}>Entre aqui</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
