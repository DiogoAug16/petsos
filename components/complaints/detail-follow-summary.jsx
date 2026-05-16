import { UserAvatar } from '@/components/ui/UserAvatar';
import { UserLink } from '@/components/ui/UserLink';
import { useAuth } from '@/context/AuthContext';
import { useRequireAuth } from '@/context/AuthPromptContext';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

const formatFollowersCount = (total) => {
  if (total === 1) return '1 acompanhando';
  return `${total} acompanhando`;
};

export function DetailFollowSummary({
  followers,
  totalFollowers,
  followersLoading,
  followLoading,
  isFollowing,
  isOwner,
  onToggleFollow,
  styles,
}) {
  const { isAuthenticated } = useAuth();
  const requireAuth = useRequireAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const followerList = Array.isArray(followers) ? followers : [];
  const canOpenFollowers = !followersLoading && totalFollowers > 0;
  const followersLabel = followersLoading ? '...' : formatFollowersCount(totalFollowers);
  const openFollowers = () => {
    if (!canOpenFollowers) return;

    requireAuth(
      () => setModalVisible(true),
      {
        title: 'Entre para ver acompanhantes',
        message:
          'Faça login ou crie uma conta para ver quem acompanha esta denúncia.',
      },
    );
  };

  return (
    <>
      <View style={styles.detailFollowSummary}>
        <Pressable
          style={styles.followersSummaryButton}
          onPress={openFollowers}
          disabled={!canOpenFollowers}
        >
          <Text style={styles.followersSummaryText}>{followersLabel}</Text>
        </Pressable>

        {!isOwner && (
          <Pressable
            style={[
              styles.detailFollowButton,
              isFollowing && styles.detailFollowButtonActive,
              followLoading && styles.detailFollowButtonDisabled,
            ]}
            onPress={() =>
              requireAuth(onToggleFollow, {
                title: 'Entre para acompanhar',
                message:
                  'Faça login ou crie uma conta para acompanhar denúncias e receber atualizações.',
              })
            }
            disabled={followLoading}
          >
            <Text
              style={[
                styles.detailFollowButtonText,
                isFollowing && styles.detailFollowButtonActiveText,
              ]}
            >
              {isFollowing ? 'Acompanhando' : 'Acompanhar'}
            </Text>
          </Pressable>
        )}
      </View>

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.followersModalOverlay}>
          <Pressable
            style={styles.followersModalBackdrop}
            onPress={() => setModalVisible(false)}
          />

          <View style={styles.followersModalCard}>
            <View style={styles.followersModalHeader}>
              <View>
                <Text style={styles.followersModalTitle}>Quem acompanha</Text>
                <Text style={styles.followersModalSubtitle}>
                  {formatFollowersCount(totalFollowers)}
                </Text>
              </View>

              <Pressable
                style={styles.followersModalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={18} color="#8A8A8E" />
              </Pressable>
            </View>

            <ScrollView style={styles.followersModalList}>
              {isAuthenticated && followerList.length > 0 ? (
                followerList.map((username) => (
                  <UserLink
                    key={username}
                    username={username}
                    style={styles.followersModalRow}
                  >
                    <UserAvatar username={username} size={34} />
                    <Text style={styles.followersModalUsername}>@{username}</Text>
                  </UserLink>
                ))
              ) : (
                <Text style={styles.followersEmpty}>
                  Ainda não há usuários acompanhando esta denúncia.
                </Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
