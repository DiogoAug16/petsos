import { AUTH_ERRORS } from '@/constants/error.messages.constants';
import { validateForm as validateFormSchema } from '@/validators/auth.validators';
import { router } from 'expo-router';
import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { useAuth } from './useAuth';

export function useAuthForm() {
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const validationErrors = validateFormSchema(form);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async () => {
    const isValid = validateForm();
    if (!isValid) return;
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      await register(
        form.email.trim(),
        form.password,
        form.name.trim(),
        form.username.trim()
      );

      Toast.show({
        type: 'success',
        text1: 'Conta criada!',
        text2: 'Verifique seu email para confirmar',
      });

      setTimeout(() => {
        router.replace('/(tabs)');
      }, 2000);
    } catch (error) {
      let errorMessage = AUTH_ERRORS.GENERIC_ERROR;

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = AUTH_ERRORS.EMAIL_ALREADY_IN_USE;
      } else if (error.code === 'auth/weak-password') {
        errorMessage = AUTH_ERRORS.WEAK_PASSWORD;
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = AUTH_ERRORS.EMAIL_INVALID;
      } else if (error.message === 'USERNAME_ALREADY_EXISTS') {
        errorMessage = AUTH_ERRORS.USERNAME_ALREADY_EXISTS;
      }

      console.error('Erro ao criar conta:', errorMessage, error);

      Toast.show({
        type: 'error',
        text1: 'Erro ao criar conta',
        text2: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    form.name.trim() &&
    form.email.trim() &&
    form.username.trim() &&
    form.password &&
    form.confirmPassword &&
    Object.keys(errors).filter(key => errors[key]).length === 0;

  return {
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
  };
}
