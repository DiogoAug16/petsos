import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';

import { toastConfig } from '@/config/toast.config';
import { AuthProvider } from '@/context/AuthContext';
import { AuthPromptProvider } from '@/context/AuthPromptContext';
import { ComplaintsProvider } from '@/context/ComplaintsContext';
import { UnreadCountProvider } from '@/context/UnreadCountContext';
import { useColorScheme } from '@/hooks/useColorScheme';

const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#E8F4F8',
    card: '#FFFFFF',
    border: '#F0F0F0',
    primary: '#FF6B35',
  },
};

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#1A1F2E',
    card: '#242B3D',
    border: '#2F3749',
    primary: '#FF6B35',
  },
};

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? CustomDarkTheme : LightTheme}>
      <AuthProvider>
        <UnreadCountProvider>
          <AuthPromptProvider>
            <ComplaintsProvider>
              <Stack screenOptions={{ detachInactiveScreens: true, animation: 'none' }}>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="complaint/[id]" options={{ headerShown: false }} />
                <Stack.Screen name="complaint/create" />
                <Stack.Screen name="users/[username]" options={{ headerShown: false }} />
                <Stack.Screen name="notifications/index" options={{ headerShown: false }} />
              </Stack>
              <Toast config={toastConfig} topOffset={60} />
            </ComplaintsProvider>
          </AuthPromptProvider>
        </UnreadCountProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
