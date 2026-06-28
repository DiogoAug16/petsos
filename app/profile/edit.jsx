import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { LoadingState } from '@/components/complaints/states/loading-state';
import { ProfileLocationAutocomplete } from '@/components/profile/profile-location-autocomplete';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { useAuth } from '@/context/AuthContext';
import { useCurrentUserProfile } from '@/hooks/profile/useCurrentUserProfile';
import { useEditProfile } from '@/hooks/profile/useEditProfile';
import { useUploadUrl } from '@/hooks/shared/useUploadUrl';
import { editProfileStyles as styles } from '@/styles/profile/edit-profile.styles';

const PROFILE_BACKGROUND = require('@/assets/images/pets/perfil_bg.webp');

export default function EditProfileScreen() {
  const router = useRouter();
  const uploadUrl = useUploadUrl();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { profile, loading, error, reload } = useCurrentUserProfile({
    enabled: isAuthenticated,
  });
  const editProfile = useEditProfile({ profile, uploadUrl });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/(tabs)/profile');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || loading) {
    return <LoadingState message="Carregando perfil..." />;
  }

  if (error) {
    return (
      <View style={styles.screen}>
        <Image source={PROFILE_BACKGROUND} style={styles.backgroundImage} contentFit="cover" />
        <View style={[styles.content, { justifyContent: 'center' }]}>
          <View style={styles.card}>
            <Text style={styles.title}>Não foi possível carregar</Text>
            <Text style={styles.helpText}>{error}</Text>
            <Pressable style={styles.saveButton} onPress={reload}>
              <Text style={styles.saveButtonText}>Tentar novamente</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  if (!profile) return null;

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <Image
        source={PROFILE_BACKGROUND}
        style={styles.backgroundImage}
        contentFit="cover"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Pressable
              style={styles.iconButton}
              onPress={editProfile.cancel}
              accessibilityRole="button"
              accessibilityLabel="Cancelar edição de perfil"
            >
              <Ionicons name="arrow-back" size={20} color="#272A3A" />
            </Pressable>

            <View style={styles.headerText}>
              <Text style={styles.eyebrow}>Perfil</Text>
              <Text style={styles.title}>Editar perfil</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.avatarSection}>
              <View style={styles.avatarFrame}>
                {editProfile.previewPhotoUri ? (
                  <Image
                    source={{ uri: editProfile.previewPhotoUri }}
                    style={styles.avatarImage}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                  />
                ) : (
                  <UserAvatar username={profile.username} size={120} textSize={42} />
                )}
              </View>

              <Pressable
                style={styles.changePhotoButton}
                onPress={editProfile.pickPhoto}
                accessibilityRole="button"
                accessibilityLabel="Escolher nova foto de perfil"
              >
                <Ionicons name="image-outline" size={18} color="#A84F16" />
                <Text style={styles.changePhotoText}>Trocar foto</Text>
              </Pressable>
            </View>

            <View style={styles.form}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                value={editProfile.name}
                onChangeText={editProfile.setName}
                placeholder="Seu nome…"
                placeholderTextColor="#A99A91"
                autoCapitalize="words"
                autoCorrect={false}
                textContentType="name"
                returnKeyType="done"
                editable={!editProfile.isSaving}
              />
              <Text style={styles.helpText}>
                Esse nome aparece no seu perfil. Seu username continua o mesmo.
              </Text>

              <Text style={styles.label}>Localização</Text>
              <ProfileLocationAutocomplete
                value={editProfile.locationLabel}
                onChangeText={editProfile.setLocationLabel}
                disabled={editProfile.isSaving}
                styles={styles}
              />
              <Text style={styles.helpText}>
                Use o formato cidade e UF, por exemplo Cuiabá, MT.
              </Text>

              <View style={styles.labelRow}>
                <Text style={styles.label}>Descrição</Text>
                <Text style={styles.counterText}>
                  {editProfile.description.trim().length}/240
                </Text>
              </View>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editProfile.description}
                onChangeText={editProfile.setDescription}
                placeholder="Conte um pouco sobre você…"
                placeholderTextColor="#A99A91"
                autoCapitalize="sentences"
                autoCorrect
                multiline
                maxLength={240}
                textAlignVertical="top"
                editable={!editProfile.isSaving}
              />
            </View>

            <View style={styles.footer}>
              <Pressable
                style={[
                  styles.saveButton,
                  editProfile.isSaving && styles.saveButtonDisabled,
                ]}
                onPress={editProfile.save}
                disabled={editProfile.isSaving}
                accessibilityRole="button"
                accessibilityLabel="Salvar alterações do perfil"
              >
                {editProfile.isSaving && (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                )}
                <Text style={styles.saveButtonText}>Salvar alterações</Text>
              </Pressable>

              <Pressable
                style={styles.cancelButton}
                onPress={editProfile.cancel}
                disabled={editProfile.isSaving}
                accessibilityRole="button"
                accessibilityLabel="Cancelar e voltar sem salvar"
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
