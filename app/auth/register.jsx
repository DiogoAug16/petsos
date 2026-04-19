import { ScrollView, KeyboardAvoidingView, Platform, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/styles/theme/Colors';
import { useAuthForm } from '@/hooks/useAuthForm';
import { useEntranceAnimation } from '@/hooks/useEntranceAnimation';
import PawBackground from '@/components/auth/PawBackground';
import AuthHero from '@/components/auth/AuthHero';
import RegisterForm from '@/components/auth/RegisterForm';
import DogPeeking from '@/components/auth/DogPeeking';
import { createRegisterStyles } from '@/styles/auth';

export default function RegisterScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const {
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
  } = useAuthForm();

  const animatedStyle = useEntranceAnimation();
  const themedStyles = createRegisterStyles(colors);
  const isDark = colors.background === '#000';

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
        >
          <AuthHero
            colors={colors}
            styles={themedStyles}
            title="Junte-se ao Movimento"
            subtitle="Proteção animal começa aqui"
          />

          <View>
            <DogPeeking />
            <RegisterForm
            form={form}
            errors={errors}
            isSubmitting={isSubmitting}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            updateField={updateField}
            handleSubmit={handleSubmit}
            isFormValid={isFormValid}
            setShowPassword={setShowPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            colors={colors}
            isDark={isDark}
            styles={themedStyles}
            />
          </View>
        </ScrollView>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}
