import { auth } from '@/config/firebase';
import { deleteAuthToken, saveFirebaseUserToken } from '@/services/auth-token.service';
import * as authService from '@/services/auth.service';
import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setIsAuthenticated(true);

        try {
          await saveFirebaseUserToken(firebaseUser);
        } catch(error) {
          // arrumar isso depois, talvez seja melhor criar um serviço específico para lidar com erros de token
          console.warn('Erro ao salvar token no SecureStore:', error);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        await deleteAuthToken();
      }

      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    const userCredential = await authService.login(email, password);
    await saveFirebaseUserToken(userCredential.user);
    return userCredential;
  };

  const logout = async () => {
    await authService.logout();
    await deleteAuthToken();
  };

  const register = async (email, password, name, username) => {
    const userCredential = await authService.register(email, password, name, username);
    await saveFirebaseUserToken(userCredential.user);
    return userCredential;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        register,
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
