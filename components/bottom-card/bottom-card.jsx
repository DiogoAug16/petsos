import { ComplaintNearbyCard } from '@/components/complaints/Complaint-nearbyCard';
import { Animated, Text, View } from 'react-native';

export function BottomCard({ style, complaint, animation }) {
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
        {complaint ? (
          <View style={style.innerBorder}>
            <ComplaintNearbyCard style={style} complaint={complaint} />
          </View>
        ) : (
          <View
            style={[
              style.innerBorder,
              { minHeight: 62, alignItems: 'center', justifyContent: 'center' },
            ]}
          >
            <Text style={style.miniCardSub}>Não há denuncias proximas</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
}
