import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';

import { ErrorState } from '@/components/complaints/states/error-state';
import { LoadingState } from '@/components/complaints/states/loading-state';
import { ProfileComplaintCard } from '@/components/profile/profile-complaint-card';
import { ProfileHeader } from '@/components/profile/profile-header';
import { useColorScheme } from '@/hooks/ui/useColorScheme';
import { useHapticPress } from '@/hooks/ui/useHapticPress';
import { usePublicProfile } from '@/hooks/profile/usePublicProfile';
import { profileStyles } from '@/styles/profile/profile.styles';

const PROFILE_BACKGROUND = require('@/assets/images/pets/perfil_bg.webp');
const FOLLOWED_BACKGROUND = require('@/assets/images/pets/denuncias_perfil_bg.webp');
const keyExtractor = (item) => String(item.id);

function EmptyFollowedList({ styles, isCurrentUser }) {
  return (
    <View style={styles.emptyWrap}>
      <Text style={styles.emptyTitle}>Nenhuma denúncia por aqui</Text>
      <Text style={styles.emptyText}>
        {isCurrentUser
          ? 'Quando você acompanhar uma denúncia, ela aparecera aqui.'
          : 'Este perfil ainda não acompanha nenhuma denúncia.'}
      </Text>
    </View>
  );
}

export function PublicProfileScreen({
  username,
  isCurrentUser = false,
  showBack = false,
  followedOnly = false,
}) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const styles = profileStyles(colorScheme);
  const {
    profile,
    followedComplaints,
    followedSummary,
    loading,
    refreshing,
    error,
    refresh,
    softReload,
    reload,
  } = usePublicProfile(username, {
    includeFollowedComplaints: !isCurrentUser || followedOnly,
  });

  useFocusEffect(
    useCallback(() => {
      softReload();
    }, [softReload])
  );

  const openFollowedComplaints = useHapticPress(() => {
    if (profile?.username) router.push(`/users/${encodeURIComponent(profile.username)}?followedOnly=1`);
  }, 'soft');

  const handleBack = useHapticPress(() => {
    if (typeof router.canGoBack === 'function' && router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(tabs)/profile');
  }, 'soft');

  if (loading) {
    return <LoadingState message="Carregando perfil..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={reload} />;
  }

  if (!profile) return null;

  if (followedOnly) {
    return (
      <View style={styles.screen}>
        <Image
          source={FOLLOWED_BACKGROUND}
          style={styles.backgroundImage}
          contentFit="cover"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
        <FlatList
          data={followedComplaints}
          keyExtractor={keyExtractor}
          renderItem={({ item }) => (
            <ProfileComplaintCard complaint={item} styles={styles} />
          )}
          ListHeaderComponent={
            <View style={styles.followedOnlyHeader}>
              <Pressable
                style={styles.heroIconButton}
                onPress={handleBack}
                accessibilityRole="button"
                accessibilityLabel="Voltar"
              >
                <Ionicons name="arrow-back" size={20} color="#272A3A" />
              </Pressable>
              <View>
                <Text style={styles.sectionKicker}>Perfil</Text>
                <Text style={styles.sectionTitle}>Denúncias acompanhadas</Text>
              </View>
            </View>
          }
          ListEmptyComponent={
            <EmptyFollowedList styles={styles} isCurrentUser={isCurrentUser} />
          }
          contentContainerStyle={styles.followedOnlyListContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor="#FF9F1C"
              colors={['#FF9F1C']}
            />
          }
        />
      </View>
    );
  }

  if (isCurrentUser) {
    return (
      <View style={styles.screen}>
        <Image
          source={PROFILE_BACKGROUND}
          style={styles.backgroundImage}
          contentFit="cover"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
        <ProfileHeader
          profile={profile}
          followedCount={followedSummary.total}
          resolvedFollowedCount={followedSummary.resolved}
          styles={styles}
          isCurrentUser={isCurrentUser}
          showBack={showBack}
          showFollowedSection={false}
          onViewFollowed={openFollowedComplaints}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Image
        source={PROFILE_BACKGROUND}
        style={styles.backgroundImage}
        contentFit="cover"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
      <FlatList
        data={followedComplaints}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => (
          <ProfileComplaintCard complaint={item} styles={styles} />
        )}
        ListHeaderComponent={
          <ProfileHeader
            profile={profile}
            followedCount={followedComplaints.length}
            followedComplaints={followedComplaints}
            styles={styles}
            isCurrentUser={isCurrentUser}
            showBack={showBack}
          />
        }
        ListEmptyComponent={
          <EmptyFollowedList styles={styles} isCurrentUser={isCurrentUser} />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor="#FF9F1C"
            colors={['#FF9F1C']}
          />
        }
      />
    </View>
  );
}
