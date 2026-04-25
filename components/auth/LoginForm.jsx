import { memo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AuthInput from './AuthInput';
import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation';
import { useButtonPulse } from '@/hooks/useButtonPulse';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function LoginForm({
  form,
  errors,
  loginError,
  isSubmitting,
  showPassword,
  updateField,
  handleSubmit,
  isFormValid,
  setShowPassword,
  colors,
  isDark,
  styles,
}) {
  const [rememberMe, setRememberMe] = useState(false);

  const titleStyle = useStaggeredAnimation(0);
  const input1Style = useStaggeredAnimation(1);
  const input2Style = useStaggeredAnimation(2);
  const optionsStyle = useStaggeredAnimation(3);
  const buttonStyle = useStaggeredAnimation(4);
  const linkStyle = useStaggeredAnimation(5);
  const pulseStyle = useButtonPulse(isSubmitting);

  return (
    <View style={styles.formCard}>
      <Animated.View style={[styles.titleContainer, titleStyle]}>
        <Text style={styles.formTitle}>Login</Text>
        <Text style={styles.formSubtitle}>
          Acesse sua conta para continuar ajudando.
        </Text>
      </Animated.View>

      <Animated.View style={input1Style}>
        <AuthInput
          label="EMAIL OU USERNAME"
          value={form.email}
          onChangeText={(value) => updateField('email', value)}
          placeholder="Email ou username"
          iconName="person-outline"
          error={errors.email}
          colors={colors}
          isDark={isDark}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isSubmitting}
        />
      </Animated.View>

      <Animated.View style={input2Style}>
        <AuthInput
          label="SENHA"
          value={form.password}
          onChangeText={(value) => updateField('password', value)}
          placeholder="Senha"
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
      </Animated.View>

      <Animated.View style={[styles.optionsRow, optionsStyle]}>
        <Pressable
          style={styles.rememberContainer}
          onPress={() => setRememberMe(!rememberMe)}
        >
          <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
            {rememberMe && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
          </View>
          <Text style={styles.rememberText}>Lembrar-me</Text>
        </Pressable>
        <Pressable onPress={() => {}}>
          <Text style={[styles.forgotPassword, { color: colors.primary }]}>
            Esqueci minha senha
          </Text>
        </Pressable>
      </Animated.View>

      <Animated.View style={buttonStyle}>
        <AnimatedPressable
          style={[
            styles.submitButton,
            (!isFormValid || isSubmitting) && styles.submitButtonDisabled,
            pulseStyle,
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid || isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Text>
        </AnimatedPressable>
        {loginError ? (
          <Text style={styles.loginErrorText}>{loginError}</Text>
        ) : null}
      </Animated.View>

      <Animated.View style={[styles.linkContainer, linkStyle]}>
        <Text style={styles.linkText}>Ainda não tem conta? </Text>
        <Pressable onPress={() => router.replace('/(auth)/register')}>
          <Text style={[styles.link, { color: colors.primary }]}>Crie sua conta</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

export default memo(LoginForm);
