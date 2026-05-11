import { styles } from '@/styles/notifications/card.styles';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

function formatRelativeTime(createdAt) {
  if (!createdAt?._seconds) return '';

  const date = new Date(createdAt._seconds * 1000);
  const now = new Date();

  const diffMs = now - date;
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'Agora';
  if (diffMinutes < 60) return `${diffMinutes} min atrás`;
  if (diffHours < 24) return `${diffHours} h atrás`;

  return `${diffDays} dia${diffDays > 1 ? 's' : ''} atrás`;
}

export function NotificationCard({ notification, onPress }) {
  const isUnread = notification.read === false;

  return (
    <Pressable
      style={[
        styles.card,
        isUnread && styles.unreadCard,
      ]}
      onPress={() => onPress(notification)}
    >
      <View style={styles.iconBox}>
        <Ionicons
          name={isUnread ? 'notifications' : 'notifications-outline'}
          size={22}
          color={isUnread ? '#F59E0B' : '#6B7280'}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.message}>
            {notification.message}
          </Text>

          {isUnread && <View style={styles.unreadDot} />}
        </View>

        <View style={styles.footer}>
          <Text style={styles.time}>
            {formatRelativeTime(notification.createdAt)}
          </Text>

          {notification.count > 1 && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>
                {notification.count}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}