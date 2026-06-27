import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import { auth } from '@/config/firebase';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

/**
 * Registra novo usuário via Client SDK e completa perfil no backend
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @param {string} name - Nome do usuário
 * @param {string} username - Username único (obrigatório)
 * @returns {Promise<UserCredential>} Credenciais do usuário autenticado
 */
export async function register(email, password, name, username) {
  await validateEmail(email);

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  try {
    await updateProfile(userCredential.user, {
      displayName: name,
    });

    const idToken = await userCredential.user.getIdToken();

    const response = await fetch(`${API_URL}/auth/complete-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        name,
        username,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'Erro ao completar perfil');
      error.code = data.errorCode;
      throw error;
    }

    sendEmailVerification(userCredential.user).catch((error) => {
      console.warn('Erro ao enviar email de verificação:', error?.message);
    });

    return userCredential;
  } catch (error) {
    await userCredential.user.delete();
    throw error;
  }
}

/**
 * Verifica se username está disponível
 * @param {string} username - Username para verificar
 * @returns {Promise<boolean>} True se disponível
 */
export async function checkUsername(username) {
  const response = await fetch(`${API_URL}/auth/check-username/${username}`);
  const data = await response.json();
  return data.data.available;
}

export async function validateEmail(email) {
  const response = await fetch(`${API_URL}/auth/validate-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(data?.message || 'Email inválido');
    error.code = data?.errorCode || 'INVALID_EMAIL';
    throw error;
  }

  return data?.data?.valid === true;
}

export async function resendVerificationEmail() {
  if (!auth.currentUser) {
    const error = new Error('Usuário não autenticado.');
    error.code = 'auth/user-not-found';
    throw error;
  }

  await sendEmailVerification(auth.currentUser);
}

export async function refreshEmailVerification() {
  if (!auth.currentUser) return false;

  await auth.currentUser.reload();
  await auth.currentUser.getIdToken(true);

  return auth.currentUser.emailVerified === true;
}

/**
 * Faz login com email e senha
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {Promise<UserCredential>} Credenciais do usuário autenticado
 */
export async function resolveUsername(username) {
  const response = await fetch(`${API_URL}/auth/resolve-username/${username}`);
  const data = await response.json();
  return data.data.email;
}

export async function login(identifier, password) {
  let email = identifier;

  if (!identifier.includes('@')) {
    const resolved = await resolveUsername(identifier);
    if (!resolved) {
      const error = new Error('Usuário não encontrado');
      error.code = 'auth/user-not-found';
      throw error;
    }
    email = resolved;
  }

  return await signInWithEmailAndPassword(auth, email, password);
}

/**
 * Faz logout do usuário atual
 * @returns {Promise<void>}
 */
export async function logout() {
  return await signOut(auth);
}
