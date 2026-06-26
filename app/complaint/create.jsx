import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

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
  const { isAuthenticated, isLoading: authLoading } = useAuth();
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
