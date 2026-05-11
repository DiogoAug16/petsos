import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { UserAvatar } from '@/components/ui/UserAvatar';
import { UserLink } from '@/components/ui/UserLink';
import { formatDate } from '@/utils/date.utils';

const formatFollowersCount = (total) => {
  if (total === 1) return '1 acompanhando';
  return `${total} acompanhando`;
};

export function DetailMainCard({
  complaint,
  address,
  followers,
  totalFollowers,
  followersLoading,
  showFollowers,
  styles,
}) {
  const [followersModalVisible, setFollowersModalVisible] = useState(false);
  const username = complaint.createdByUsername;
  const followerList = Array.isArray(followers) ? followers : [];
  const followersLabel = followersLoading ? '...' : formatFollowersCount(totalFollowers);
  const canOpenFollowers = !followersLoading && totalFollowers > 0;

  return (
    <>
      <View style={styles.detailMainCard}>
        <Text style={styles.detailMainTitle}>{complaint.title}</Text>

        <View style={styles.detailMainMetaRow}>
          <Ionicons name="location-outline" size={16} color="#8A8A8E" />
          <Text style={styles.detailMainMetaText} numberOfLines={2}>
            {address || 'Localizacao'}
          </Text>
        </View>

        {!!complaint.description && (
          <>
            <View style={styles.detailMainDivider} />
            <Text style={styles.detailMainSectionLabel}>Descricao</Text>
            <Text style={styles.detailMainDescription}>{complaint.description}</Text>
          </>
        )}

        <View style={styles.detailMainDivider} />
        <View style={styles.detailMainFooter}>
          <UserLink username={username} style={styles.detailMainRegistrar}>
            <UserAvatar username={username} size={36} textSize={15} />
            <View style={styles.detailMainRegistrarCopy}>
              <Text style={styles.detailRegistrarName}>
                {username ? `@${username}` : 'Usuario desconhecido'}
              </Text>
              <Text style={styles.detailRegistrarDate}>
                {formatDate(complaint.createdAt)}
              </Text>
            </View>
          </UserLink>

          {showFollowers && (
            <Pressable
              style={styles.detailMainFollowersButton}
              onPress={() => setFollowersModalVisible(true)}
              disabled={!canOpenFollowers}
            >
              <Text style={styles.detailMainFollowersText}>{followersLabel}</Text>
            </Pressable>
          )}
        </View>
      </View>

      <Modal
        transparent
        visible={followersModalVisible}
        animationType="fade"
        onRequestClose={() => setFollowersModalVisible(false)}
      >
        <View style={styles.followersModalOverlay}>
          <Pressable
            style={styles.followersModalBackdrop}
            onPress={() => setFollowersModalVisible(false)}
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
                onPress={() => setFollowersModalVisible(false)}
              >
                <Ionicons name="close" size={18} color="#8A8A8E" />
              </Pressable>
            </View>

            <ScrollView style={styles.followersModalList}>
              {followerList.length > 0 ? (
                followerList.map((followerUsername) => (
                  <UserLink
                    key={followerUsername}
                    username={followerUsername}
                    style={styles.followersModalRow}
                  >
                    <UserAvatar username={followerUsername} size={34} />
                    <Text style={styles.followersModalUsername}>
                      @{followerUsername}
                    </Text>
                  </UserLink>
                ))
              ) : (
                <Text style={styles.followersEmpty}>
                  Ainda nao ha usuarios acompanhando esta denuncia.
                </Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
