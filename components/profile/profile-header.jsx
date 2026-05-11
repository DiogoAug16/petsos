import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Modal, Pressable, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { ProfileBadge } from '@/components/profile/profile-badge';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { useAuth } from '@/context/AuthContext';
import { getJoinedYear } from '@/utils/profile.utils';

export function ProfileHeader({
  profile,
  followedCount,
  styles,
  isCurrentUser,
  showBack,
  rightComponent
}) {
  const router = useRouter();
  const { logout } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const joinedYear = getJoinedYear(profile.createdAt);
  const displayName = profile.name || profile.username;
  const shouldShowBack = showBack || isCurrentUser;

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
    Toast.show({
      type: 'success',
      text1: 'Você saiu da conta',
    });
    router.replace('/(tabs)');
  };

  return (
    <>
      <View style={styles.hero}>
        <View style={styles.heroActions}>
          {shouldShowBack ? (
            <Pressable style={styles.heroIconButton} onPress={handleBack}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </Pressable>
          ) : (
            <View style={styles.heroIconButtonPlaceholder} />
          )}

          {isCurrentUser && (
            <Pressable
              style={styles.heroIconButton}
              onPress={() => setMenuVisible(true)}
            >
              <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.profileBody}>
        <View style={styles.avatarWrap}>
          <UserAvatar username={profile.username} size={96} textSize={36} />
        </View>

        <View style={styles.nameRow}>
          <Text style={styles.name}>{displayName}</Text>
          {rightComponent}
        </View>
        <Text style={styles.username}>@{profile.username} - Cuiaba, MT</Text>

        <Text style={styles.bio}>
          Voluntário animal desde 2026. Acredito que todo ser vivo merece
          respeito e cuidado.
        </Text>

        <View style={styles.badgesRow}>
          <ProfileBadge label="Voluntario" tone="orange" styles={styles} />
          <ProfileBadge label="Verificado" tone="green" styles={styles} />
          <ProfileBadge label={`${joinedYear}`} tone="blue" styles={styles} />
        </View>
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
              <Ionicons name="create-outline" size={18} color="#fff" />
              <Text style={styles.profileMenuText}>Editar</Text>
            </Pressable>
            <Pressable style={styles.profileMenuItem} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={18} color="#E24B4A" />
              <Text style={styles.profileMenuDangerText}>Sair</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionKicker}>Denúncias acompanhadas</Text>
          <Text style={styles.sectionTitle}>
            {followedCount} {followedCount === 1 ? 'denúncia' : 'denúncias'}
          </Text>
        </View>
      </View>
    </>
  );
}
