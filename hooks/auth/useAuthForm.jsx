import { AUTH_ERRORS } from '@/constants/errors/error.messages.constants';
import { validateForm as validateFormSchema } from '@/validators/auth.validators';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { checkUsername } from '@/services/auth/auth.service';

const USERNAME_CHECK_DEBOUNCE_MS = 450;
const isUsernameSyntaxValid = (username) => {
  const trimmed = username.trim();
  return trimmed.length >= 4 && /^[a-zA-Z0-9_]+$/.test(trimmed);
};

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
  const usernameCheckRef = useRef(0);

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
    if (errors.username === AUTH_ERRORS.USERNAME_ALREADY_EXISTS) {
      validationErrors.username = AUTH_ERRORS.USERNAME_ALREADY_EXISTS;
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  useEffect(() => {
    const username = form.username.trim();
    const requestId = usernameCheckRef.current + 1;
    usernameCheckRef.current = requestId;

    if (!isUsernameSyntaxValid(username)) return undefined;

    const timeoutId = setTimeout(async () => {
      try {
        const available = await checkUsername(username);
        if (requestId !== usernameCheckRef.current) return;

        setErrors((prev) => {
          if (!available) {
            return {
              ...prev,
              username: AUTH_ERRORS.USERNAME_ALREADY_EXISTS,
            };
          }

          if (prev.username !== AUTH_ERRORS.USERNAME_ALREADY_EXISTS) return prev;
          const next = { ...prev };
          delete next.username;
          return next;
        });
      } catch (error) {
        console.warn('Username availability check failed', error?.message);
      }
    }, USERNAME_CHECK_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [form.username]);

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

      router.replace('/(auth)/login');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setErrors((prev) => ({ ...prev, email: AUTH_ERRORS.EMAIL_ALREADY_IN_USE }));
      } else if (error.code === 'auth/invalid-email' || error.code === 'INVALID_EMAIL') {
        setErrors((prev) => ({ ...prev, email: AUTH_ERRORS.EMAIL_INVALID }));
      } else if (error.code === 'auth/weak-password') {
        setErrors((prev) => ({ ...prev, password: AUTH_ERRORS.WEAK_PASSWORD }));
      } else if (error.code === 'USERNAME_ALREADY_EXISTS') {
        setErrors((prev) => ({ ...prev, username: AUTH_ERRORS.USERNAME_ALREADY_EXISTS }));
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
