import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Alert, Pressable, Text, View } from 'react-native';

import { CreateAuthRequired } from '@/components/complaints/create/create-auth-required';
import { CreateComplaintFooter } from '@/components/complaints/create/create-complaint-footer';
import { CreateComplaintForm } from '@/components/complaints/create/create-complaint-form';
import { useAuth } from '@/context/AuthContext';
import { useAuthPrompt } from '@/context/AuthPromptContext';
import { useCreateComplaintForm } from '@/hooks/complaints/useCreateComplaintForm';
import {
  createComplaintColors,
  createComplaintStyles as styles,
} from '@/styles/complaints/create.styles';

export default function CreateComplaintScreen() {
  const router = useRouter();
  const { edit, id } = useLocalSearchParams();
  const complaintId = Array.isArray(id) ? id[0] : id;
  const {
    isAuthenticated,
    isEmailVerified,
    isLoading: authLoading,
    refreshEmailVerification,
    resendVerificationEmail,
  } = useAuth();
  const { openAuthPrompt } = useAuthPrompt();
  const isEdit = edit === 'true' && complaintId;
  const {
    form,
    location,
    manualLocation,
    isSubmitting,
    isLoadingEdit,
    handleAuthRequiredPress,
    handleGoBack,
    handleSubmit,
    setManualLocation,
    updateField,
  } = useCreateComplaintForm({
    complaintId,
    isAuthenticated,
    isEdit,
    authLoading,
    openAuthPrompt,
    router,
  });

  if (authLoading) {
    return <CreateAuthRequired loading styles={styles} />;
  }

  if (!isAuthenticated) {
    return (
      <CreateAuthRequired
        onPress={handleAuthRequiredPress}
        styles={styles}
      />
    );
  }

  if (!isEmailVerified) {
    return (
      <CreateAuthRequired
        title="Confirme seu email"
        message="Confirme seu email para criar denúncias e participar das ações da comunidade."
        buttonText="Reenviar email"
        secondaryButtonText="Já confirmei"
        onPress={async () => {
          try {
            await resendVerificationEmail();
            Alert.alert(
              'Email enviado',
              'Enviamos um novo link de confirmação para o seu email.',
            );
          } catch {
            Alert.alert('Erro', 'Não foi possível reenviar o email agora.');
          }
        }}
        onSecondaryPress={async () => {
          try {
            const verified = await refreshEmailVerification();
            if (!verified) {
              Alert.alert(
                'Ainda não confirmado',
                'Abra o link enviado para seu email e tente novamente.',
              );
            }
          } catch {
            Alert.alert('Erro', 'Não foi possível verificar seu email agora.');
          }
        }}
        styles={styles}
      />
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: isEdit ? 'Editar Denúncia' : 'Nova Denúncia',
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={handleGoBack}
              hitSlop={12}
              style={styles.headerBackContainer}
            >
              <Ionicons
                name="chevron-back"
                size={20}
                color={createComplaintColors.orange}
              />
              <Text style={styles.headerButton}>Voltar</Text>
            </Pressable>
          ),
        }}
      />

      <View style={styles.screen}>
        {isLoadingEdit ? (
          <View style={styles.loadingContainer}>
            <Text>Carregando dados...</Text>
          </View>
        ) : (
          <CreateComplaintForm
            form={form}
            location={location}
            manualLocation={manualLocation}
            onChangeManualLocation={setManualLocation}
            onUpdateField={updateField}
            styles={styles}
          />
        )}

        <CreateComplaintFooter
          isEdit={isEdit}
          isLoadingEdit={isLoadingEdit}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          styles={styles}
        />
      </View>
    </>
  );
}
