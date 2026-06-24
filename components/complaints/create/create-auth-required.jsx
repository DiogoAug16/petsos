import { Stack } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export function CreateAuthRequired({ loading, onPress, styles }) {
  if (loading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.authRequiredScreen}>
          <Text style={styles.authRequiredText}>Carregando...</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.authRequiredScreen}>
        <Text style={styles.authRequiredTitle}>Criar denúncia</Text>
        <Text style={styles.authRequiredText}>
          Entre ou crie sua conta para registrar uma denúncia.
        </Text>
        <Pressable style={styles.authRequiredButton} onPress={onPress}>
          <Text style={styles.authRequiredButtonText}>Entrar ou criar conta</Text>
        </Pressable>
      </View>
    </>
  );
}
