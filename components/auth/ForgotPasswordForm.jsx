import { memo } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AuthInput from './AuthInput';
import { useButtonPulse } from '@/hooks/ui/useButtonPulse';
import { useHapticPress } from '@/hooks/ui/useHapticPress';
import { useStaggeredAnimation } from '@/hooks/ui/useStaggeredAnimation';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function ForgotPasswordForm({
  form,
  errors,
  successMessage,
  submitError,
  isSubmitting,
  updateField,
  handleSubmit,
  colors,
  isDark,
  styles,
}) {
  const titleStyle = useStaggeredAnimation(0);
  const inputStyle = useStaggeredAnimation(1);
  const buttonStyle = useStaggeredAnimation(2);
  const linkStyle = useStaggeredAnimation(3);
  const pulseStyle = useButtonPulse(isSubmitting);
  const handleSubmitPress = useHapticPress(handleSubmit, 'normal');
  const handleBackPress = useHapticPress(() => router.replace('/(auth)/login'));

  return (
    <View style={styles.formCard}>
      <Animated.View style={[styles.titleContainer, titleStyle]}>
        <Text style={styles.formTitle}>Recuperar senha</Text>
        <Text style={styles.formSubtitle}>
          Informe o email da sua conta para receber o link de recuperação.
        </Text>
      </Animated.View>

      <Animated.View style={inputStyle}>
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

      {successMessage ? (
        <Text style={styles.successText}>{successMessage}</Text>
      ) : null}

      {submitError ? (
        <Text style={styles.loginErrorText}>{submitError}</Text>
      ) : null}

      <Animated.View style={buttonStyle}>
        <AnimatedPressable
          style={[
            styles.submitButton,
            isSubmitting && styles.submitButtonDisabled,
            pulseStyle,
          ]}
          onPress={handleSubmitPress}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Ionicons name="mail-outline" size={20} color="#FFFFFF" />
          )}
          <Text style={styles.submitButtonText}>Enviar recuperação</Text>
        </AnimatedPressable>
      </Animated.View>

      <Animated.View style={[styles.linkContainer, linkStyle]}>
        <Pressable onPress={handleBackPress}>
          <Text style={[styles.link, { color: colors.primary }]}>
            Voltar para o login
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

export default memo(ForgotPasswordForm);
