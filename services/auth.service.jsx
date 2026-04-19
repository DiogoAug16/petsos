import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const COLLECTION_PREFIX = process.env.EXPO_PUBLIC_FIREBASE_COLLECTION_PREFIX || '';
const USERS_COLLECTION = `${COLLECTION_PREFIX}users`;
const USERNAMES_COLLECTION = `${COLLECTION_PREFIX}usernames`;

/**
 * Registra novo usuário com email e senha
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @param {string} name - Nome do usuário
 * @param {string} username - Username único (obrigatório)
 * @returns {Promise<UserCredential>} Credenciais do usuário criado
 */
export async function register(email, password, name, username) {
  const usernameDoc = await getDoc(doc(db, USERNAMES_COLLECTION, username.toLowerCase()));
  if (usernameDoc.exists()) {
    throw new Error('USERNAME_ALREADY_EXISTS');
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  await updateProfile(userCredential.user, {
    displayName: name,
  });

  await setDoc(doc(db, USERS_COLLECTION, userCredential.user.uid), {
    email,
    name,
    username: username.toLowerCase(),
    createdAt: new Date().toISOString(),
  });

  await setDoc(doc(db, USERNAMES_COLLECTION, username.toLowerCase()), {
    email,
    uid: userCredential.user.uid,
  });

  return userCredential;
}

/**
 * Faz login com email/username e senha
 * @param {string} emailOrUsername - Email ou username do usuário
 * @param {string} password - Senha do usuário
 * @returns {Promise<UserCredential>} Credenciais do usuário autenticado
 */
export async function login(emailOrUsername, password) {
    let email = emailOrUsername;

  if (!emailOrUsername.includes('@')) {
    const usernameDoc = await getDoc(doc(db, USERNAMES_COLLECTION, emailOrUsername.toLowerCase()));

    if (!usernameDoc.exists()) {
      throw new Error('USER_NOT_FOUND');
    }

    email = usernameDoc.data().email;
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

/**
 * Retorna usuário atualmente autenticado
 * @returns {User | null} Usuário autenticado ou null
 */
export function getCurrentUser() {
  return auth.currentUser;
}
