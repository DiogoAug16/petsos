import { Animated, Text, View } from 'react-native';

export function BottomCard({ style, complaint, animation }) {
  if (!complaint) return null;

  const { translateY, panResponder, setCardHeight } = animation;

  return (
    <Animated.View
      style={[style.bottomCard, { transform: [{ translateY }] }]}
      onLayout={(e) => setCardHeight(e.nativeEvent.layout.height)}
      {...panResponder.panHandlers}
    >
      <View style={style.bottomHandle} />
      <Text style={style.bottomTitle}>DENÚNCIA PRÓXIMA</Text>
      <View style={style.miniCard}>
        <View style={style.miniCardPhoto}>
          <Text style={style.miniCardEmoji}>{complaint.emoji}</Text>
        </View>
        <View style={style.miniCardInfo}>
          <Text style={style.miniCardTitle} numberOfLines={1}>
            {complaint.title}
          </Text>
          <Text style={style.miniCardSub}>
            📍 {complaint.address} · {complaint.time}
          </Text>
        </View>
        <View style={style.miniCardBadge}>
          <Text style={style.miniCardBadgeText}>
            {complaint.status === 'aberto' ? 'Aberto' : complaint.status}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}