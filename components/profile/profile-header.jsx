import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Modal, Pressable, Text, View } from 'react-native';

import { UserAvatar } from '@/components/ui/UserAvatar';
import { useAuth } from '@/context/AuthContext';
import { getJoinedYear } from '@/utils/profile/profile.utils';

export function ProfileHeader({
  profile,
  followedCount,
  resolvedFollowedCount: resolvedFollowedCountProp,
  followedComplaints = [],
  styles,
  isCurrentUser,
  showBack,
  rightComponent,
  showFollowedSection = true,
  onViewFollowed,
}) {
  const router = useRouter();
  const { logout } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const joinedYear = getJoinedYear(profile.createdAt);
  const displayName = profile.name || profile.username;
  const shouldShowBack = showBack && !isCurrentUser;
  const resolvedFollowedCount =
    resolvedFollowedCountProp ??
    followedComplaints.filter((complaint) =>
      ['resolvido', 'resolved'].includes(complaint?.status)
    ).length;

  const handleEdit = () => {
    setMenuVisible(false);
    Alert.alert('Editar perfil', 'Edição de perfil em breve.');
  };

  const handleBack = () => {
    if (typeof router.canGoBack === 'function' && router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(tabs)');
  };

  const handleLogout = async () => {
    setMenuVisible(false);
    await logout();
    router.replace('/(tabs)');
  };

  return (
    <>
      <View style={styles.hero}>
        <View style={styles.heroActions}>
          {shouldShowBack ? (
            <Pressable style={styles.heroIconButton} onPress={handleBack}>
              <Ionicons name="arrow-back" size={20} color="#272A3A" />
            </Pressable>
          ) : (
            <View style={styles.heroIconButtonPlaceholder} />
          )}

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {isCurrentUser && rightComponent}
            {isCurrentUser && (
              <Pressable
                style={styles.heroIconButton}
                onPress={() => setMenuVisible(true)}
              >
                <Ionicons name="ellipsis-vertical" size={20} color="#272A3A" />
              </Pressable>
            )}
          </View>
        </View>
      </View>

      <View style={styles.profileBody}>
        <View style={styles.avatarWrap}>
          <UserAvatar username={profile.username} size={96} textSize={36} />
        </View>

        <View style={styles.nameRow}>
          <Text style={styles.name}>{displayName}</Text>
        </View>
        <Text style={styles.username}>@{profile.username} - Cuiabá, MT</Text>

        <Text style={styles.bio}>
          Voluntário animal desde 2026. Acredito que todo ser vivo merece
          respeito e cuidado.
        </Text>

        <View style={styles.profileStatsRow}>
          <View style={styles.profileStat}>
            <Text style={styles.profileStatValue}>{followedCount}</Text>
            <Text style={styles.profileStatLabel}>Acompanhadas</Text>
          </View>
          {resolvedFollowedCount > 0 && (
            <>
              <View style={styles.profileStatDivider} />
              <View style={styles.profileStat}>
                <Text style={styles.profileStatValue}>{resolvedFollowedCount}</Text>
                <Text style={styles.profileStatLabel}>
                  {resolvedFollowedCount === 1 ? 'Resolvida' : 'Resolvidas'}
                </Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.accountStatusCard}>
          <View style={styles.accountStatusItem}>
            <Ionicons name="heart-circle" size={18} color="#FF9F1C" />
            <Text style={styles.accountStatusText}>Voluntário</Text>
          </View>
          <View style={styles.accountStatusItem}>
            <Ionicons name="checkmark-circle" size={18} color="#1A936F" />
            <Text style={styles.accountStatusText}>Conta verificada</Text>
          </View>
          <View style={styles.accountStatusItem}>
            <Ionicons name="calendar-outline" size={18} color="#FF9F1C" />
            <Text style={styles.accountStatusText}>Membro desde {joinedYear}</Text>
          </View>
          <View style={styles.accountStatusItem}>
            <Ionicons name="location-outline" size={18} color="#7C5CFF" />
            <Text style={styles.accountStatusText}>Cuiabá, MT</Text>
          </View>
        </View>

        {onViewFollowed && (
          <Pressable
            style={styles.profileActionButton}
            onPress={onViewFollowed}
            accessibilityRole="button"
            accessibilityLabel="Ver denúncias acompanhadas"
          >
            <Text style={styles.profileActionButtonText}>Ver denúncias acompanhadas</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </Pressable>
        )}
      </View>

      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.profileMenuBackdrop}>
          <Pressable
            style={styles.profileMenuDismissArea}
            onPress={() => setMenuVisible(false)}
          />
          <View style={styles.profileMenu}>
            <Pressable style={styles.profileMenuItem} onPress={handleEdit}>
              <Ionicons name="create-outline" size={18} color="#272A3A" />
              <Text style={styles.profileMenuText}>Editar</Text>
            </Pressable>
            <Pressable style={styles.profileMenuItem} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={18} color="#E24B4A" />
              <Text style={styles.profileMenuDangerText}>Sair</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {showFollowedSection && (
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionKicker}>Denúncias acompanhadas</Text>
            <Text style={styles.sectionTitle}>
              {followedCount} {followedCount === 1 ? 'denúncia' : 'denúncias'}
            </Text>
          </View>
        </View>
      )}
    </>
  );
}
