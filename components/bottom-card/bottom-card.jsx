import { ComplaintNearbyCard } from '@/components/complaints/Complaint-nearbyCard';
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
        <View style={style.innerBorder}>
          <ComplaintNearbyCard style={style} complaint={complaint} />
        </View>
      </View>
    </Animated.View>
  );
}