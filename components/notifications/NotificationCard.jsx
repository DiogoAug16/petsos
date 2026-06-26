import { styles } from '@/styles/notifications/card.styles';
import { useHaptics } from '@/hooks/ui/useHaptics';
import { usePressAnimation } from '@/hooks/ui/usePressAnimation';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

function formatRelativeTime(createdAt) {
  if (!createdAt) return '';

  let date;
  if (createdAt._seconds) {
    date = new Date(createdAt._seconds * 1000);
  } else if (createdAt.seconds) {
    date = new Date(createdAt.seconds * 1000);
  } else if (typeof createdAt === 'string' || typeof createdAt === 'number') {
    date = new Date(createdAt);
  } else {
    return '';
  }

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
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation();
  const { triggerHaptics } = useHaptics();
  const handlePressIn = () => {
    onPressIn();
    triggerHaptics('soft');
  };
  const getIcon = () => {
    switch (notification.type) {
      case 'new_comment':
      case 'comment_group':
      case 'comment_reply':
        return 'chatbubble-ellipses-outline';
      case 'status_change':
      case 'complaint_resolved':
      case 'complaint_resolved_community':
      case 'complaint_closed_community':
      case 'complaint_rejected_community':
        return 'checkmark-circle-outline';
      case 'validation_request':
        return 'shield-checkmark-outline';
      default:
        return isUnread ? 'notifications' : 'notifications-outline';
    }
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={onPressOut}
      onPress={() => onPress(notification)}
      accessibilityRole="button"
      accessibilityLabel={`Abrir notificação: ${notification.message}`}
    >
      <Animated.View
        style={[
          styles.card,
          isUnread && styles.unreadCard,
          animatedStyle,
        ]}
      >
        <View style={styles.iconBox}>
          <Ionicons
            name={getIcon()}
            size={21}
            color={isUnread ? '#FF8C42' : '#8D7D78'}
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
      </Animated.View>
    </Pressable>
  );
}
