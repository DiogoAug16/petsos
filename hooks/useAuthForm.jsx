import { AUTH_ERRORS } from '@/constants/error.messages.constants';
import { validateForm as validateFormSchema } from '@/validators/auth.validators';
import { router } from 'expo-router';
import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/context/AuthContext';

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
        text2: 'Verifique seu email e faça login para continuar',
      });

      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 2000);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setErrors((prev) => ({ ...prev, email: AUTH_ERRORS.EMAIL_ALREADY_IN_USE }));
      } else if (error.code === 'auth/invalid-email') {
        setErrors((prev) => ({ ...prev, email: AUTH_ERRORS.EMAIL_INVALID }));
      } else if (error.code === 'auth/weak-password') {
        setErrors((prev) => ({ ...prev, password: AUTH_ERRORS.WEAK_PASSWORD }));
      } else if (error.code === 'USERNAME_ALREADY_EXISTS') {
        setErrors((prev) => ({ ...prev, username: AUTH_ERRORS.USERNAME_ALREADY_EXISTS }));
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erro ao criar conta',
          text2: error.message || AUTH_ERRORS.GENERIC_ERROR,
        });
      }
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
