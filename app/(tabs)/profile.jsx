import { useFocusEffect } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';

import { ErrorState } from '@/components/complaints/error-state';
import { LoadingState } from '@/components/complaints/loading-state';
import { PublicProfileScreen } from '@/components/profile/public-profile-screen';
import { useAuth } from '@/context/AuthContext';
import { useAuthPrompt } from '@/context/AuthPromptContext';
import { useCurrentUserProfile } from '@/hooks/useCurrentUserProfile';
import { useColorScheme } from '@/hooks/useColorScheme';
import { profileStyles } from '@/styles/profile.styles';

const PROFILE_BACKGROUND = require('@/assets/images/pets/perfil_bg.webp');

function GuestProfileScreen() {
  const colorScheme = useColorScheme();
  const styles = profileStyles(colorScheme);
  const { openAuthPrompt } = useAuthPrompt();

  const openPrompt = useCallback(() => {
    openAuthPrompt({
      title: 'Entre para ver seu perfil',
      message:
        'Seu perfil reúne as denúncias que você acompanha e suas informações públicas.',
    });
  }, [openAuthPrompt]);

  useFocusEffect(
    useCallback(() => {
      openPrompt();
    }, [openPrompt]),
  );

  return (
    <View style={styles.authRequiredScreen}>
      <Image
        source={PROFILE_BACKGROUND}
        style={styles.backgroundImage}
        contentFit="cover"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
      <View style={styles.authRequiredCard}>
        <Text style={styles.authRequiredTitle}>Perfil</Text>
        <Text style={styles.authRequiredText}>
          Entre ou crie sua conta para acessar seu perfil.
        </Text>
        <Pressable style={styles.authRequiredButton} onPress={openPrompt}>
          <Text style={styles.authRequiredButtonText}>Entrar ou criar conta</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function ProfileTab() {
  const { isAuthenticated, isLoading } = useAuth();
  const { profile, loading, error, reload } = useCurrentUserProfile({
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return <LoadingState message="Carregando..." />;
  }

  if (!isAuthenticated) {
    return <GuestProfileScreen />;
  }

  if (loading) {
    return <LoadingState message="Carregando perfil..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={reload} />;
  }

  if (!profile?.username) {
    return (
      <ErrorState
        message="Não foi possivel identificar o seu perfil."
        onRetry={reload}
      />
    );
  }

  return <PublicProfileScreen username={profile.username} isCurrentUser />;
}
