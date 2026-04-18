import { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { register } from '@/services/auth.service';

export function useAuthForm() {
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
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (form.name.trim().length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = 'Email inválido';
    }

    if (form.username.trim()) {
      if (form.username.trim().length < 3) {
        newErrors.username = 'Username deve ter pelo menos 3 caracteres';
      } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
        newErrors.username = 'Username pode conter apenas letras, números e _';
      }
    }

    if (!form.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (form.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Confirme sua senha';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      await register(
        form.email.trim(),
        form.password,
        form.name.trim(),
        form.username.trim() || null
      );

      Alert.alert('Sucesso', 'Conta criada com sucesso!', [
        {
          text: 'OK',
          onPress: () => router.replace('/(tabs)'),
        },
      ]);
    } catch (error) {
      console.error('Erro ao criar conta:', error);

      let errorMessage = 'Não foi possível criar conta. Tente novamente.';

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este email já está cadastrado';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Senha muito fraca';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido';
      } else if (error.message === 'USERNAME_ALREADY_EXISTS') {
        errorMessage = 'Este username já está em uso';
      }

      Alert.alert('Erro', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    form.name.trim() &&
    form.email.trim() &&
    form.password &&
    form.confirmPassword &&
    Object.keys(errors).length === 0;

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
