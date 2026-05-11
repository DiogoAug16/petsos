import { useUnreadCount } from '@/hooks/useUnreadCount';
import { styles } from '@/styles/notifications/bell.styles';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export function NotificationBell() {
  const router = useRouter();
  const { unreadCount } = useUnreadCount();

  return (
    <Pressable
      style={styles.container}
      onPress={() => router.push('/notifications')}
    >
      <Ionicons name="notifications-outline" size={24} color="#111827" />

      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </View>
      )}
    </Pressable>
  );
}