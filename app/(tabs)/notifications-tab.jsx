import { LoadingState } from '@/components/complaints/states/loading-state';
import { NotificationCard } from '@/components/notifications/NotificationCard';
import { useAuth } from '@/context/AuthContext';
import { useAuthPrompt } from '@/context/AuthPromptContext';
import { useColorScheme } from '@/hooks/ui/useColorScheme';
import { useHapticPress } from '@/hooks/ui/useHapticPress';
import { useNotifications } from '@/hooks/notifications/useNotifications';
import { useUnreadCount } from '@/hooks/notifications/useUnreadCount';
import {
  clearNotifications,
  markNotificationAsRead,
} from '@/services/notifications/notifications.service';
import { styles } from '@/styles/notifications/screen.styles';
import { profileStyles } from '@/styles/profile/profile.styles';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';

const NOTIFICATIONS_BACKGROUND = require('@/assets/images/pets/notificacoes_bg.webp');

function GuestNotificationsScreen() {
  const colorScheme = useColorScheme();
  const guestStyles = profileStyles(colorScheme);
  const { openAuthPrompt } = useAuthPrompt();

  const openPrompt = useCallback(() => {
    openAuthPrompt({
      title: 'Entre para ver notificações',
      message:
        'Faça login ou crie uma conta para receber alertas sobre denúncias que você acompanha.',
    });
  }, [openAuthPrompt]);

  useFocusEffect(
    useCallback(() => {
      openPrompt();
    }, [openPrompt]),
  );

  return (
    <View style={guestStyles.authRequiredScreen}>
      <Image
        source={NOTIFICATIONS_BACKGROUND}
        style={guestStyles.backgroundImage}
        contentFit="cover"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
      <View style={guestStyles.authRequiredCard}>
        <Text style={guestStyles.authRequiredTitle}>Notificações</Text>
        <Text style={guestStyles.authRequiredText}>
          Entre ou crie sua conta para receber notificações.
        </Text>
        <Pressable style={guestStyles.authRequiredButton} onPress={openPrompt}>
          <Text style={guestStyles.authRequiredButtonText}>
            Entrar ou criar conta
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function NotificationsContent() {
  const router = useRouter();
  const { reloadUnreadCount } = useUnreadCount();
  const {
    notifications,
    loading,
    refreshing,
    refresh,
    reload,
  } = useNotifications();

  const handleClearNotifications = useHapticPress(() => {
    Alert.alert(
      'Limpar notificações',
      'Todas as notificações serão removidas.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearNotifications();
              await reload();
              reloadUnreadCount();
            } catch (error) {
              console.log('Erro ao limpar notificações:', error);
            }
          },
        },
      ]
    );
  }, 'normal');

  useFocusEffect(
    useCallback(() => {
      reload();
      reloadUnreadCount();
    }, [reload, reloadUnreadCount])
  );

  async function handlePressNotification(notification) {
    try {
      if (!notification.read) {
        await markNotificationAsRead(notification.id);
        reloadUnreadCount();
      }

      await reload();
      router.push(`/complaint/${notification.complaintId}`);
    } catch (error) {
      console.log('Erro ao abrir notificação:', error);
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={NOTIFICATIONS_BACKGROUND}
        style={styles.backgroundImage}
        contentFit="cover"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Notificações</Text>
            <Text style={styles.subtitle}>
              Alertas sobre denúncias que você acompanha.
            </Text>
          </View>

          {notifications.length > 0 && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Limpar notificações"
              style={styles.clearButton}
              onPress={handleClearNotifications}
            >
              <Ionicons name="trash-outline" size={18} color="#E94B5F" />
            </Pressable>
          )}
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FF9F1C" />
          <Text style={styles.loadingText}>
            Carregando notificações...
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationCard
              notification={item}
              onPress={handlePressNotification}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={refresh}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons
                name="notifications-off-outline"
                size={48}
                color="#9CA3AF"
              />

              <Text style={styles.emptyTitle}>
                Nenhuma notificação
              </Text>

              <Text style={styles.emptyText}>
                Suas notificações aparecerão aqui.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

export default function NotificationsScreen() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState message="Carregando…" />;
  }

  if (!isAuthenticated) {
    return <GuestNotificationsScreen />;
  }

  return <NotificationsContent />;
}
