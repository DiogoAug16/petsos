import { View, Text, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AuthInput from './AuthInput';
import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation';
import { useButtonPulse } from '@/hooks/useButtonPulse';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
  const input1Style = useStaggeredAnimation(0);
  const input2Style = useStaggeredAnimation(1);
  const input3Style = useStaggeredAnimation(2);
  const input4Style = useStaggeredAnimation(3);
  const input5Style = useStaggeredAnimation(4);
  const buttonStyle = useStaggeredAnimation(5);
  const linkStyle = useStaggeredAnimation(6);
  const pulseStyle = useButtonPulse(isSubmitting);

  return (
    <View style={styles.formCard}>
      <Animated.View style={input1Style}>
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
      </Animated.View>

      <Animated.View style={input2Style}>
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
      </Animated.View>

      <Animated.View style={input3Style}>
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
      </Animated.View>

      <Animated.View style={input4Style}>
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
        showPasswordStrength
        autoCapitalize="none"
        autoCorrect={false}
        editable={!isSubmitting}
      />
      </Animated.View>

      <Animated.View style={input5Style}>
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
          {isSubmitting ? 'Criando conta...' : 'Criar Conta'}
        </Text>
        <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
      </AnimatedPressable>
      </Animated.View>

      <Animated.View style={[styles.linkContainer, linkStyle]}>
        <Text style={styles.linkText}>Já faz parte? </Text>
        <Link href="/auth/login" asChild>
          <Pressable>
            <Text style={[styles.link, { color: colors.primary }]}>Entre aqui</Text>
          </Pressable>
        </Link>
      </Animated.View>
    </View>
  );
}
