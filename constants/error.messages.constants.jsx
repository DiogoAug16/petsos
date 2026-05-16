export const AUTH_ERRORS = {
  NAME_REQUIRED: 'Nome é obrigatório',
  NAME_MIN_LENGTH: 'Nome deve ter pelo menos 2 caracteres',

  EMAIL_REQUIRED: 'Email é obrigatório',
  EMAIL_INVALID: 'Email inválido',

  USERNAME_REQUIRED: 'Username é obrigatório',
  USERNAME_MIN_LENGTH: 'Username deve ter pelo menos 4 caracteres',
  USERNAME_INVALID: 'Username pode conter apenas letras, números e _',

  PASSWORD_REQUIRED: 'Senha é obrigatória',
  PASSWORD_MIN_LENGTH: 'Senha deve ter pelo menos 8 caracteres',
  PASSWORD_WEAK: 'Senha deve conter letras maiúsculas, minúsculas e números',

  CONFIRM_PASSWORD_REQUIRED: 'Confirme sua senha',
  PASSWORDS_DONT_MATCH: 'Senhas não coincidem',

  EMAIL_ALREADY_IN_USE: 'Este email já está cadastrado',
  USERNAME_ALREADY_EXISTS: 'Este username já está em uso',
  WEAK_PASSWORD: 'Senha muito fraca',
  GENERIC_ERROR: 'Não foi possível criar conta. Tente novamente.',
};
