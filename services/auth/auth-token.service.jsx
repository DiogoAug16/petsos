import * as SecureStore from 'expo-secure-store';

const AUTH_TOKEN_KEY = 'authToken';

const saveAuthToken = (token) =>
  SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);

export const deleteAuthToken = () =>
  SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);

export const saveFirebaseUserToken = async (user) => {
  const token = await user.getIdToken(user.emailVerified === true);
  await saveAuthToken(token);
};
