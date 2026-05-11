import { FlatList, RefreshControl, Text, View } from 'react-native';

import { ErrorState } from '@/components/complaints/error-state';
import { LoadingState } from '@/components/complaints/loading-state';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { ProfileComplaintCard } from '@/components/profile/profile-complaint-card';
import { ProfileHeader } from '@/components/profile/profile-header';
import { useColorScheme } from '@/hooks/useColorScheme';
import { usePublicProfile } from '@/hooks/usePublicProfile';
import { profileStyles } from '@/styles/profile.styles';

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
}) {
  const colorScheme = useColorScheme();
  const styles = profileStyles(colorScheme);
  const {
    profile,
    followedComplaints,
    loading,
    refreshing,
    error,
    refresh,
    reload,
  } = usePublicProfile(username);

  if (loading) {
    return <LoadingState message="Carregando perfil..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={reload} />;
  }

  if (!profile) return null;

  return (
    <View style={styles.screen}>
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
            styles={styles}
            isCurrentUser={isCurrentUser}
            showBack={showBack}
            rightComponent={<NotificationBell />}
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
            tintColor="#FF6B35"
            colors={['#FF6B35']}
          />
        }
      />
    </View>
  );
}
