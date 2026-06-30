import { auth } from '@/config/firebase';
import { deleteAuthToken, saveFirebaseUserToken } from '@/services/auth/auth-token.service';
import * as authService from '@/services/auth/auth.service';
import { checkAdminModerationAccess } from '@/services/complaints/complaints.service';
import { appLogger } from '@/utils/shared/app-logger';
import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const loadAdminAccess = useCallback(async (firebaseUser) => {
    if (!firebaseUser || firebaseUser.emailVerified !== true) {
      setIsAdmin(false);
      return false;
    }

    try {
      const nextIsAdmin = await checkAdminModerationAccess();
      setIsAdmin(nextIsAdmin);
      return nextIsAdmin;
    } catch (error) {
      appLogger.warn('Erro ao verificar acesso admin no backend', { error });
      setIsAdmin(false);
      return false;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setIsAuthenticated(true);
        setIsEmailVerified(firebaseUser.emailVerified === true);

        try {
          await saveFirebaseUserToken(firebaseUser);
        } catch(error) {
          appLogger.warn('Erro ao salvar token no SecureStore', { error });
        }

        await loadAdminAccess(firebaseUser);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setIsEmailVerified(false);
        setIsAdmin(false);
        await deleteAuthToken();
      }

      setIsLoading(false);
    });

    return unsubscribe;
  }, [loadAdminAccess]);

  const login = async (email, password) => {
    const userCredential = await authService.login(email, password);
    await saveFirebaseUserToken(userCredential.user);
    setIsEmailVerified(userCredential.user.emailVerified === true);
    await loadAdminAccess(userCredential.user);
    return userCredential;
  };

  const logout = async () => {
    await authService.logout();
    await deleteAuthToken();
    setIsAdmin(false);
  };

  const register = async (email, password, name, username) => {
    const userCredential = await authService.register(email, password, name, username);
    await saveFirebaseUserToken(userCredential.user);
    setIsEmailVerified(userCredential.user.emailVerified === true);
    await loadAdminAccess(userCredential.user);
    return userCredential;
  };

  const resendVerificationEmail = async () => {
    await authService.resendVerificationEmail();
  };

  const refreshEmailVerification = async () => {
    const verified = await authService.refreshEmailVerification();

    if (auth.currentUser) {
      setUser(auth.currentUser);
      await saveFirebaseUserToken(auth.currentUser);
      await loadAdminAccess(auth.currentUser);
    }

    setIsEmailVerified(verified);
    return verified;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        isEmailVerified,
        isAdmin,
        login,
        logout,
        register,
        resendVerificationEmail,
        refreshEmailVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
