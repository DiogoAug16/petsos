import { AUTH_ERRORS } from '@/constants/errors/error.messages.constants';
import { useAuth } from '@/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { appLogger } from '@/utils/shared/app-logger';

const REMEMBER_LOGIN_KEY = '@petsos:remember-login';
const REMEMBERED_IDENTIFIER_KEY = '@petsos:remembered-identifier';

export function useLoginForm() {
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadRememberedIdentifier = async () => {
      try {
        const [rememberLogin, rememberedIdentifier] = await Promise.all([
          AsyncStorage.getItem(REMEMBER_LOGIN_KEY),
          AsyncStorage.getItem(REMEMBERED_IDENTIFIER_KEY),
        ]);

        if (!isMounted || rememberLogin !== 'true') return;

        setRememberMe(true);
        if (rememberedIdentifier) {
          setForm((prev) => ({
            ...prev,
            email: rememberedIdentifier,
          }));
        }
      } catch (error) {
        appLogger.warn('Erro ao carregar login lembrado', { error });
      }
    };

    loadRememberedIdentifier();

    return () => {
      isMounted = false;
    };
  }, []);

  const persistRememberedIdentifier = async (identifier) => {
    if (!rememberMe) {
      await Promise.all([
        AsyncStorage.removeItem(REMEMBER_LOGIN_KEY),
        AsyncStorage.removeItem(REMEMBERED_IDENTIFIER_KEY),
      ]);
      return;
    }

    await Promise.all([
      AsyncStorage.setItem(REMEMBER_LOGIN_KEY, 'true'),
      AsyncStorage.setItem(REMEMBERED_IDENTIFIER_KEY, identifier),
    ]);
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
    if (loginError) setLoginError('');
  };

  const validateForm = () => {
    const validationErrors = {};

    if (!form.email.trim()) {
      validationErrors.email = 'Email ou username é obrigatório';
    }

    if (!form.password) {
      validationErrors.password = AUTH_ERRORS.PASSWORD_REQUIRED;
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async () => {
    const isValid = validateForm();
    if (!isValid) return;
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const identifier = form.email.trim();
      await login(identifier, form.password);
      await persistRememberedIdentifier(identifier);
      router.replace('/(tabs)');
    } catch (error) {
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/invalid-email'
      ) {
        setLoginError('Verifique a sua senha e nome de usuário/email e tente novamente.');
      } else {
        setLoginError('Não foi possível entrar. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    form.email.trim() &&
    form.password &&
    Object.keys(errors).filter(key => errors[key]).length === 0;

  return {
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
  };
}
