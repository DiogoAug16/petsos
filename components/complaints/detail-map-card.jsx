import { Pressable, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export function DetailMapCard({ location, address, onOpenMap, styles }) {
  if (!location) return null;

  return (
    <View style={styles.detailCard}>
      <Text style={styles.detailSectionLabel}>Localização</Text>
      <Pressable onPress={onOpenMap}>
        <View style={styles.detailMapContainer}>
          <MapView
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
            <Marker coordinate={location} />
          </MapView>
        </View>
      </Pressable>
      <Text style={styles.detailMapAddress}>{address}</Text>
    </View>
  );
}
