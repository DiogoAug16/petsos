import { AUTH_ERRORS } from '@/constants/error.messages.constants';
import { router } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

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

      await login(form.email.trim(), form.password);

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
    updateField,
    handleSubmit,
    isFormValid,
    setShowPassword,
  };
}
