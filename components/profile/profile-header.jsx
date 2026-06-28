import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Modal, Pressable, Text, View } from 'react-native';

import { UserAvatar } from '@/components/ui/UserAvatar';
import { useAuth } from '@/context/AuthContext';
import { useUploadUrl } from '@/hooks/shared/useUploadUrl';
import { buildUploadPhotoUri } from '@/utils/media/photo.utils';
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
  const {
    isEmailVerified,
    logout,
    refreshEmailVerification,
    resendVerificationEmail,
  } = useAuth();
  const uploadUrl = useUploadUrl();
  const [menuVisible, setMenuVisible] = useState(false);
  const joinedYear = getJoinedYear(profile.createdAt);
  const displayName = profile.name || profile.username;
  const photoUri = buildUploadPhotoUri(profile.photoUrl, uploadUrl);
  const locationLabel = profile.locationLabel?.trim() || '';
  const description = profile.description?.trim() || '';
  const shouldShowBack = showBack && !isCurrentUser;
  const shouldShowOwnEmailStatus = isCurrentUser;
  const resolvedFollowedCount =
    resolvedFollowedCountProp ??
    followedComplaints.filter((complaint) =>
      ['resolvido', 'resolved'].includes(complaint?.status)
    ).length;

  const handleEdit = () => {
    setMenuVisible(false);
    router.push('/profile/edit');
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

  const handleResendVerification = async () => {
    try {
      await resendVerificationEmail();
      Alert.alert(
        'Email enviado',
        'Enviamos um novo link de confirmação para o seu email.',
      );
    } catch {
      Alert.alert('Erro', 'Não foi possível reenviar o email agora.');
    }
  };

  const handleRefreshVerification = async () => {
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
          <UserAvatar
            username={profile.username}
            imageUri={photoUri}
            size={96}
            textSize={36}
          />
        </View>

        <View style={styles.nameRow}>
          <Text style={styles.name}>{displayName}</Text>
        </View>
        <Text style={styles.username}>
          {locationLabel ? `@${profile.username} - ${locationLabel}` : `@${profile.username}`}
        </Text>

        {description ? <Text style={styles.bio}>{description}</Text> : null}

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
            <Ionicons
              name={
                shouldShowOwnEmailStatus && !isEmailVerified
                  ? 'mail-unread-outline'
                  : 'checkmark-circle'
              }
              size={18}
              color={
                shouldShowOwnEmailStatus && !isEmailVerified ? '#E29A2F' : '#1A936F'
              }
            />
            <Text style={styles.accountStatusText}>
              {shouldShowOwnEmailStatus
                ? isEmailVerified
                  ? 'Email confirmado'
                  : 'Email pendente'
                : 'Conta verificada'}
            </Text>
          </View>
          <View style={styles.accountStatusItem}>
            <Ionicons name="calendar-outline" size={18} color="#FF9F1C" />
            <Text style={styles.accountStatusText}>Membro desde {joinedYear}</Text>
          </View>
          {locationLabel ? (
            <View style={styles.accountStatusItem}>
              <Ionicons name="location-outline" size={18} color="#7C5CFF" />
              <Text style={styles.accountStatusText}>{locationLabel}</Text>
            </View>
          ) : null}
        </View>

        {isCurrentUser && !isEmailVerified ? (
          <View style={styles.emailVerificationCard}>
            <View style={styles.emailVerificationContent}>
              <Ionicons name="mail-unread-outline" size={18} color="#E29A2F" />
              <View style={styles.emailVerificationCopy}>
                <Text style={styles.emailVerificationTitle}>Email pendente</Text>
                <Text style={styles.emailVerificationText}>
                  Confirme para participar.
                </Text>
              </View>
            </View>
            <View style={styles.emailVerificationActions}>
              <Pressable onPress={handleResendVerification} hitSlop={8}>
                <Text style={styles.emailVerificationActionText}>Reenviar</Text>
              </Pressable>
              <View style={styles.emailVerificationDivider} />
              <Pressable onPress={handleRefreshVerification} hitSlop={8}>
                <Text style={styles.emailVerificationActionText}>Verificar</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

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
