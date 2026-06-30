import { auth } from '@/config/firebase';
import { deleteAuthToken } from '@/services/auth/auth-token.service';
import { logout as logoutAuth } from '@/services/auth/auth.service';
import { router } from 'expo-router';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const getAuthHeaders = async (headers, forceRefresh = false) => {
  const nextHeaders = { ...headers };

  if (!auth.currentUser) return nextHeaders;

  try {
    const token = await auth.currentUser.getIdToken(forceRefresh);
    nextHeaders.Authorization = `Bearer ${token}`;
  } catch {
    await deleteAuthToken();
  }

  return nextHeaders;
};

export async function apiFetch(endpoint, options = {}) {
  if (!API_URL) {
    throw new Error('EXPO_PUBLIC_API_URL não configurada.');
  }

  const { skipAuthRedirect = false, ...fetchOptions } = options;
  const requestUrl = `${API_URL}${endpoint}`;
  const request = async (forceRefresh = false) =>
    fetch(requestUrl, {
      ...fetchOptions,
      headers: await getAuthHeaders(fetchOptions.headers, forceRefresh),
    });

  let response = await request();

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
    const shouldRetryVerifiedEmailToken =
      response.status === 403 &&
      errorBody?.errorCode === 'EMAIL_NOT_VERIFIED' &&
      auth.currentUser?.emailVerified === true;

    if (shouldRetryVerifiedEmailToken) {
      response = await request(true);

      if (response.ok) {
        if (response.status === 204) return null;
        return response.json();
      }
    }

    const message =
      errorBody?.message || `Erro ${response.status}: ${response.statusText}`;
    const error = new Error(message);
    error.status = response.status;
    error.code = errorBody?.errorCode;
    throw error;
  }

  if (response.status === 204) return null;

  return response.json();
}
