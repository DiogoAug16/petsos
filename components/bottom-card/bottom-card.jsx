import { mapScreenStyles } from '@/components/styles/mapScreen.styles.jsx';
import { useColorScheme } from '@/components/useColorScheme.jsx';
import { Animated, Text, View } from 'react-native';
import { useBottomCardAnimation } from './bottom-card.animation';

export function BottomCard({ complaint }) {
  const colorScheme = useColorScheme() ?? 'light';
  const styles = mapScreenStyles(colorScheme);

  const { translateY, panResponder, setCardHeight } =
    useBottomCardAnimation();

  if (!complaint) return null;

  return (
    <Animated.View
      style={[styles.bottomCard, { transform: [{ translateY }] }]}
      onLayout={(e) => setCardHeight(e.nativeEvent.layout.height)}
      {...panResponder.panHandlers}
    >
      <View style={styles.bottomHandle} />
      <Text style={styles.bottomTitle}>DENÚNCIA PRÓXIMA</Text>
      <View style={styles.miniCard}>
        <View style={styles.miniCardPhoto}>
          <Text style={styles.miniCardEmoji}>{complaint.emoji}</Text>
        </View>
        <View style={styles.miniCardInfo}>
          <Text style={styles.miniCardTitle} numberOfLines={1}>
            {complaint.title}
          </Text>
          <Text style={styles.miniCardSub}>
            📍 {complaint.address} · {complaint.time}
          </Text>
        </View>
        <View style={styles.miniCardBadge}>
          <Text style={styles.miniCardBadgeText}>
            {complaint.status === 'aberto' ? 'Aberto' : complaint.status}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}