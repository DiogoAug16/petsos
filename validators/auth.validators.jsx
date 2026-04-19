import { AUTH_ERRORS } from '@/constants/error.messages.constants';
import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z
      .string()
      .refine((val) => val.trim().length > 0, {
        message: AUTH_ERRORS.NAME_REQUIRED,
      })
      .refine((val) => val.trim().length >= 2, {
        message: AUTH_ERRORS.NAME_MIN_LENGTH,
      }),

    email: z
      .string()
      .refine((val) => val.trim().length > 0, {
        message: AUTH_ERRORS.EMAIL_REQUIRED,
      })
      .transform((val) => val.trim())
      .pipe(z.email({ message: AUTH_ERRORS.EMAIL_INVALID })),

    username: z
      .string()
      .refine((val) => val.trim().length > 0, {
        message: AUTH_ERRORS.USERNAME_REQUIRED,
      })
      .refine((val) => val.trim().length >= 4, {
        message: AUTH_ERRORS.USERNAME_MIN_LENGTH,
      })
      .refine((val) => /^[a-zA-Z0-9_]+$/.test(val.trim()), {
        message: AUTH_ERRORS.USERNAME_INVALID,
      }),

    password: z
      .string()
      .refine((val) => val.length > 0, {
        message: AUTH_ERRORS.PASSWORD_REQUIRED,
      })
      .refine((val) => val.length >= 8, {
        message: AUTH_ERRORS.PASSWORD_MIN_LENGTH,
      })
      .refine((val) => /[A-Z]/.test(val) && /[a-z]/.test(val) && /[0-9]/.test(val), {
        message: AUTH_ERRORS.PASSWORD_WEAK,
      }),

    confirmPassword: z
      .string()
      .refine((val) => val.length > 0, {
        message: AUTH_ERRORS.CONFIRM_PASSWORD_REQUIRED,
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: AUTH_ERRORS.PASSWORDS_DONT_MATCH,
    path: ['confirmPassword'],
  });

export const validateForm = (formData) => {
  const result = registerSchema.safeParse(formData);

  if (result.success) {
    return {};
  }

  const errors = {};
  result.error.issues.forEach((issue) => {
    if (issue.path && issue.path.length > 0) {
      errors[issue.path[0]] = issue.message;
    }
  });

  return errors;
};
