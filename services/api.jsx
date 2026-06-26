import { auth } from '@/config/firebase';
import { deleteAuthToken } from '@/services/auth/auth-token.service';
import { logout as logoutAuth } from '@/services/auth/auth.service';
import { router } from 'expo-router';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function apiFetch(endpoint, options = {}) {
  if (!API_URL) {
    throw new Error('EXPO_PUBLIC_API_URL não configurada.');
  }

  const { skipAuthRedirect = false, ...fetchOptions } = options;
  const headers = { ...fetchOptions.headers };

  if (auth.currentUser) {
    try {
      const token = await auth.currentUser.getIdToken();
      headers['Authorization'] = `Bearer ${token}`;
    } catch {
      await deleteAuthToken();
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (response.status === 401) {
    if (skipAuthRedirect) {
      throw new Error('Não autorizado.');
    }

    try {
      await logoutAuth();
    } finally {
      await deleteAuthToken();
    }
    router.replace('/(auth)/login');
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message =
      errorBody?.message || `Erro ${response.status}: ${response.statusText}`;
    throw new Error(message);
  }

  if (response.status === 204) return null;

  return response.json();
}
