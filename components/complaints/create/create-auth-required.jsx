import { Stack } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export function CreateAuthRequired({
  buttonText = 'Entrar ou criar conta',
  loading,
  message = 'Entre ou crie sua conta para registrar uma denúncia.',
  onPress,
  onSecondaryPress,
  secondaryButtonText,
  styles,
  title = 'Criar denúncia',
}) {
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
        <Text style={styles.authRequiredTitle}>{title}</Text>
        <Text style={styles.authRequiredText}>{message}</Text>
        <Pressable style={styles.authRequiredButton} onPress={onPress}>
          <Text style={styles.authRequiredButtonText}>{buttonText}</Text>
        </Pressable>
        {secondaryButtonText && onSecondaryPress ? (
          <Pressable
            style={styles.authRequiredSecondaryButton}
            onPress={onSecondaryPress}
          >
            <Text style={styles.authRequiredSecondaryButtonText}>
              {secondaryButtonText}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </>
  );
}
