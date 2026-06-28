import { AUTH_ERRORS } from '@/constants/errors/error.messages.constants';
import { sendPasswordReset } from '@/services/auth/auth.service';
import { validateForgotPasswordForm } from '@/validators/auth.validators';
import { useState } from 'react';

const getResetErrorMessage = (error) => {
  if (error.code === 'auth/user-not-found') {
    return AUTH_ERRORS.PASSWORD_RESET_USER_NOT_FOUND;
  }

  if (error.code === 'auth/invalid-email') {
    return AUTH_ERRORS.EMAIL_INVALID;
  }

  if (error.code === 'auth/too-many-requests') {
    return AUTH_ERRORS.PASSWORD_RESET_TOO_MANY_REQUESTS;
  }

  return AUTH_ERRORS.PASSWORD_RESET_GENERIC;
};

export function useForgotPasswordForm() {
  const [form, setForm] = useState({ email: '' });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      const nextErrors = { ...errors };
      delete nextErrors[field];
      setErrors(nextErrors);
    }
    if (submitError) setSubmitError('');
    if (successMessage) setSuccessMessage('');
  };

  const validateForm = () => {
    const validationErrors = validateForgotPasswordForm(form);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      setSubmitError('');
      await sendPasswordReset(form.email);
      setSuccessMessage(
        'Enviamos as instruções para o seu email. Verifique sua caixa de entrada.',
      );
    } catch (error) {
      setSubmitError(getResetErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    errors,
    successMessage,
    submitError,
    isSubmitting,
    updateField,
    handleSubmit,
  };
}
