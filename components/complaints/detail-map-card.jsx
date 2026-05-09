import { UnifiedMapView, UnifiedMarker } from '@/components/map/provider';
import { Pressable, Text, View } from 'react-native';

export function DetailMapCard({ location, address, onOpenMap, styles }) {
  if (!location) return null;

  return (
    <View style={styles.detailCard}>
      <Text style={styles.detailSectionLabel}>Localização</Text>
      <Pressable onPress={onOpenMap}>
        <View style={styles.detailMapContainer}>
          <UnifiedMapView
            style={styles.detailMap}
            region={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.003,
              longitudeDelta: 0.003,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
            pointerEvents="none"
          >
            <UnifiedMarker coordinate={location} />
          </UnifiedMapView>
        </View>
      </Pressable>
      <Text style={styles.detailMapAddress}>{address}</Text>
    </View>
  );
}
