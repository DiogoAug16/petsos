import {
  signInWithEmailAndPassword,
  signInWithCustomToken,
  signOut,
  sendEmailVerification,
} from 'firebase/auth';
import { auth } from '../config/firebase';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

/**
 * Registra novo usuário via backend e autentica
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @param {string} name - Nome do usuário
 * @param {string} username - Username único (obrigatório)
 * @returns {Promise<UserCredential>} Credenciais do usuário autenticado
 */
export async function register(email, password, name, username) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      name,
      username,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'Erro ao criar conta');
    error.code = data.errorCode;
    throw error;
  }

  const userCredential = await signInWithCustomToken(auth, data.data.customToken);

  await sendEmailVerification(userCredential.user);

  return userCredential;
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

/**
 * Faz login com email e senha
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {Promise<UserCredential>} Credenciais do usuário autenticado
 */
export async function login(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}

/**
 * Faz logout do usuário atual
 * @returns {Promise<void>}
 */
export async function logout() {
  return await signOut(auth);
}

/**
 * Retorna usuário atualmente autenticado
 * @returns {User | null} Usuário autenticado ou null
 */
export function getCurrentUser() {
  return auth.currentUser;
}
