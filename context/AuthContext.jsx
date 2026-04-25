import { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '@/config/firebase';
import * as authService from '@/services/auth.service';

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
          const token = await firebaseUser.getIdToken();
          await AsyncStorage.setItem('authToken', token);
        } catch (error) {
          console.log('Erro ao salvar token:', error);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        await AsyncStorage.removeItem('authToken');
      }

      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    const userCredential = await authService.login(email, password);
    const token = await userCredential.user.getIdToken();
    await AsyncStorage.setItem('authToken', token);
    return userCredential;
  };

  const logout = async () => {
    await authService.logout();
    await AsyncStorage.removeItem('authToken');
  };

  const register = async (email, password, name, username) => {
    const userCredential = await authService.register(email, password, name, username);
    const token = await userCredential.user.getIdToken();
    await AsyncStorage.setItem('authToken', token);
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
