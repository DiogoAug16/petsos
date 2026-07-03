import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import Animated from 'react-native-reanimated';
import AuthHero from '@/components/auth/AuthHero';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import PawBackground from '@/components/auth/PawBackground';
import { useForgotPasswordForm } from '@/hooks/auth/useForgotPasswordForm';
import { useColorScheme } from '@/hooks/ui/useColorScheme';
import { useEntranceAnimation } from '@/hooks/ui/useEntranceAnimation';
import { createLoginStyles } from '@/styles/auth';
import Colors from '@/styles/theme/Colors';

export default function ForgotPasswordScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const animatedStyle = useEntranceAnimation();
  const themedStyles = createLoginStyles(colors);
  const isDark = colors.background !== '#FFF6EC';

  const {
    form,
    errors,
    successMessage,
    submitError,
    isSubmitting,
    updateField,
    handleSubmit,
  } = useForgotPasswordForm();

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
            title="Acesse novamente"
            subtitle="Recupere sua conta com segurança"
          />

          <View>
            <ForgotPasswordForm
              form={form}
              errors={errors}
              successMessage={successMessage}
              submitError={submitError}
              isSubmitting={isSubmitting}
              updateField={updateField}
              handleSubmit={handleSubmit}
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
