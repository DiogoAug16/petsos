import { ScrollView, KeyboardAvoidingView, Platform, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useColorScheme } from '@/hooks/ui/useColorScheme';
import Colors from '@/styles/theme/Colors';
import { useLoginForm } from '@/hooks/auth/useLoginForm';
import { useEntranceAnimation } from '@/hooks/ui/useEntranceAnimation';
import PawBackground from '@/components/auth/PawBackground';
import AuthHero from '@/components/auth/AuthHero';
import LoginForm from '@/components/auth/LoginForm';
import CatAndDogPeeking from '@/components/auth/CatAndDogPeeking';
import LoginSocialPlaceholder from '@/components/auth/LoginSocialPlaceholder';
import { createLoginStyles } from '@/styles/auth';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const {
    form,
    errors,
    loginError,
    isSubmitting,
    showPassword,
    rememberMe,
    updateField,
    handleSubmit,
    isFormValid,
    setShowPassword,
    setRememberMe,
  } = useLoginForm();

  const animatedStyle = useEntranceAnimation();
  const themedStyles = createLoginStyles(colors);
  const isDark = colors.background !== '#FFF6EC';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={themedStyles.container}
    >
      <PawBackground isDark={isDark} />

      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        <ScrollView
          contentContainerStyle={themedStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          removeClippedSubviews={true}
        >
          <AuthHero
            colors={colors}
            styles={themedStyles}
            title="Bem-vindo de Volta"
            subtitle="Entre para continuar sua missão"
          />

          <View>
            <CatAndDogPeeking />
            <LoginForm
              form={form}
              errors={errors}
              loginError={loginError}
              isSubmitting={isSubmitting}
              showPassword={showPassword}
              rememberMe={rememberMe}
              updateField={updateField}
              handleSubmit={handleSubmit}
              isFormValid={isFormValid}
              setShowPassword={setShowPassword}
              setRememberMe={setRememberMe}
              colors={colors}
              isDark={isDark}
              styles={themedStyles}
            />
          </View>

          <LoginSocialPlaceholder styles={themedStyles} />
        </ScrollView>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}
