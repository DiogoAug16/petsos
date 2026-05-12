import { NotificationCard } from '@/components/notifications/NotificationCard';
import { useNotifications } from '@/hooks/useNotifications';
import { useUnreadCount } from '@/hooks/useUnreadCount';
import { markNotificationAsRead } from '@/services/notifications.service';
import { styles } from '@/styles/notifications/screen.styles';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';

export default function NotificationsScreen() {
  const router = useRouter();

  const { reloadUnreadCount } = useUnreadCount();

  const {
    notifications,
    loading,
    refreshing,
    refresh,
    reload,
  } = useNotifications();

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
    <>
      <Stack.Screen
        options={{
          title: 'Notificações',
          headerShown: true,
          presentation: 'card',
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              hitSlop={12}
              style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 4, paddingRight: 8 }}
            >
              <Ionicons name="chevron-back" size={20} color="#FF6B35" />
              <Text style={{ color: '#FF6B35', fontSize: 16, fontWeight: '700' }}>Voltar</Text>
            </Pressable>
          ),
        }}
      />

      <View style={styles.container}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" />
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
    </>
  );
}