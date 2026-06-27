import { useAuth } from '@/context/AuthContext';
import { useAuthPrompt } from '@/context/AuthPromptContext';
import { useCallback } from 'react';

const DEFAULT_TITLE = 'Confirme seu email';
const DEFAULT_MESSAGE =
  'Confirme seu email para criar denúncias e participar das ações da comunidade.';

export function useRequireVerifiedEmail() {
  const {
    isAuthenticated,
    isEmailVerified,
    refreshEmailVerification,
    resendVerificationEmail,
  } = useAuth();
  const { closeAuthPrompt, openAuthPrompt } = useAuthPrompt();

  return useCallback(
    (action, options = {}) => {
      if (!isAuthenticated) return false;

      if (isEmailVerified) {
        action?.();
        return true;
      }

      const title = options.title || DEFAULT_TITLE;
      const message = options.message || DEFAULT_MESSAGE;

      openAuthPrompt({
        title,
        message,
        primaryLabel: 'Reenviar email',
        secondaryLabel: 'Já confirmei',
        onPrimaryPress: async () => {
          try {
            await resendVerificationEmail();
          } catch (error) {
            console.warn('Verification email resend failed', error?.message);
          }
        },
        onSecondaryPress: async () => {
          try {
            const verified = await refreshEmailVerification();

            if (verified) {
              closeAuthPrompt();
              action?.();
            }
          } catch (error) {
            console.warn('Email verification refresh failed', error?.message);
          }
        },
      });

      return false;
    },
    [
      isAuthenticated,
      isEmailVerified,
      refreshEmailVerification,
      resendVerificationEmail,
      closeAuthPrompt,
      openAuthPrompt,
    ],
  );
}
