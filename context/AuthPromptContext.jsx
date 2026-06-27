import { AuthPromptBottomSheet } from '@/components/auth/AuthPromptBottomSheet';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const DEFAULT_PROMPT = {
  title: 'Entre para continuar',
  message:
    'Crie uma conta ou faça login para participar das denúncias, comentar e acompanhar atualizações.',
  primaryLabel: 'Criar conta',
  secondaryLabel: 'Entrar',
  onPrimaryPress: null,
  onSecondaryPress: null,
};

const AuthPromptContext = createContext(null);

export function AuthPromptProvider({ children }) {
  const router = useRouter();
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [promptVisible, setPromptVisible] = useState(false);

  const openAuthPrompt = useCallback((options = {}) => {
    setPrompt({
      ...DEFAULT_PROMPT,
      ...options,
    });
    setPromptVisible(true);
  }, []);

  const closeAuthPrompt = useCallback(() => {
    setPromptVisible(false);
  }, []);

  const goToLogin = useCallback(() => {
    closeAuthPrompt();
    router.push('/(auth)/login');
  }, [closeAuthPrompt, router]);

  const goToRegister = useCallback(() => {
    closeAuthPrompt();
    router.push('/(auth)/register');
  }, [closeAuthPrompt, router]);

  const handlePrimaryPress = useCallback(() => {
    if (prompt.onPrimaryPress) {
      prompt.onPrimaryPress();
      return;
    }

    goToRegister();
  }, [goToRegister, prompt]);

  const handleSecondaryPress = useCallback(() => {
    if (prompt.onSecondaryPress) {
      prompt.onSecondaryPress();
      return;
    }

    goToLogin();
  }, [goToLogin, prompt]);

  const value = useMemo(
    () => ({
      openAuthPrompt,
      closeAuthPrompt,
    }),
    [closeAuthPrompt, openAuthPrompt],
  );

  return (
    <AuthPromptContext.Provider value={value}>
      {children}
      <AuthPromptBottomSheet
        visible={promptVisible}
        title={prompt.title}
        message={prompt.message}
        primaryLabel={prompt.primaryLabel}
        secondaryLabel={prompt.secondaryLabel}
        onClose={closeAuthPrompt}
        onPrimaryPress={handlePrimaryPress}
        onSecondaryPress={handleSecondaryPress}
      />
    </AuthPromptContext.Provider>
  );
}

export function useAuthPrompt() {
  const context = useContext(AuthPromptContext);

  if (!context) {
    throw new Error('useAuthPrompt deve ser usado dentro de AuthPromptProvider');
  }

  return context;
}

export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const { openAuthPrompt } = useAuthPrompt();

  return useCallback(
    (action, promptOptions) => {
      if (isAuthenticated) {
        action?.();
        return true;
      }

      if (!isLoading) {
        openAuthPrompt(promptOptions);
      }

      return false;
    },
    [isAuthenticated, isLoading, openAuthPrompt],
  );
}
