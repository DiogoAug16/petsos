import { ModerationCard } from '@/components/admin/moderation/moderation-card';
import { ModerationDecisionModal } from '@/components/admin/moderation/moderation-decision-modal';
import { ModerationEmptyState } from '@/components/admin/moderation/moderation-empty-state';
import { ModerationHeader } from '@/components/admin/moderation/moderation-header';
import { ErrorState } from '@/components/complaints/states/error-state';
import { LoadingState } from '@/components/complaints/states/loading-state';
import { useAuth } from '@/context/AuthContext';
import { useAdminModeration } from '@/hooks/admin/useAdminModeration';
import { adminModerationStyles as styles } from '@/styles/admin/moderation.styles';
import { getModerationComplaintId } from '@/utils/admin/moderation.utils';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const keyExtractor = (item) => String(getModerationComplaintId(item));

export default function AdminModerationScreen() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const authReady = !isLoading;
  const canAccess = authReady && isAuthenticated && isAdmin;

  const moderation = useAdminModeration({ canAccess });

  useEffect(() => {
    if (!authReady || canAccess) return;

    Alert.alert(
      'Acesso negado',
      'Esta área é exclusiva para administradores.',
      [{ text: 'OK', onPress: () => router.replace('/(tabs)/profile') }]
    );
  }, [authReady, canAccess, router]);

  const header = useMemo(
    () => (
      <ModerationHeader
        count={moderation.items.length}
        onBack={() => router.replace('/(tabs)/profile')}
        styles={styles}
      />
    ),
    [moderation.items.length, router]
  );

  if (!authReady) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <LoadingState message="Carregando moderação..." />
      </>
    );
  }

  if (!canAccess) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <ErrorState
          message="Acesso negado. Esta área é exclusiva para administradores."
          onRetry={() => router.replace('/(tabs)/profile')}
        />
      </>
    );
  }

  if (moderation.loading && moderation.items.length === 0) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <LoadingState message="Carregando moderação..." />
      </>
    );
  }

  if (moderation.error && moderation.items.length === 0) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <ErrorState
          message={moderation.error}
          onRetry={() => moderation.loadPending()}
        />
      </>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <FlatList
        data={moderation.items}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => (
          <ModerationCard
            item={item}
            onAction={moderation.openDecision}
            styles={styles}
          />
        )}
        ListHeaderComponent={header}
        ListEmptyComponent={<ModerationEmptyState styles={styles} />}
        ListFooterComponent={
          moderation.loadingMore ? <ActivityIndicator color="#FF9F1C" /> : null
        }
        onEndReached={moderation.loadMore}
        onEndReachedThreshold={0.35}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={moderation.refreshing}
            onRefresh={moderation.refresh}
            tintColor="#FF9F1C"
            colors={['#FF9F1C']}
          />
        }
      />

      <ModerationDecisionModal
        action={moderation.selectedAction}
        reason={moderation.reason}
        submitting={moderation.submitting}
        styles={styles}
        onChangeReason={moderation.setReason}
        onClose={moderation.closeDecision}
        onSubmit={moderation.submitDecision}
      />
    </SafeAreaView>
  );
}
