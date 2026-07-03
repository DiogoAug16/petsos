import { Pressable, Text, View } from 'react-native';
import MapView from 'react-native-maps';
import { ComplaintMarker } from '@/components/map/markers/complaint-marker';
import { Ionicons } from '@expo/vector-icons';

export function DetailMapCard({ complaint, location, address, onOpenMap, styles }) {
  if (!location) return null;

  return (
    <View style={styles.detailCard}>
      <View style={styles.detailSectionHeader}>
        <View style={styles.detailSectionIcon}>
          <Ionicons name="location-outline" size={16} color="#FF8C42" />
        </View>
        <View style={styles.detailSectionCopy}>
          <Text style={styles.detailSectionLabel}>Localização</Text>
          <Text style={styles.detailSectionHint}>Toque para ver na aba Mapa</Text>
        </View>
      </View>
      <Pressable
        onPress={onOpenMap}
        accessibilityRole="button"
        accessibilityLabel="Abrir mapa da denúncia"
      >
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
            <ComplaintMarker complaint={complaint} />
          </MapView>
          <View style={styles.detailMapOpenBadge}>
            <Ionicons name="expand-outline" size={14} color="#272A3A" />
          </View>
        </View>
      </Pressable>
      <Text style={styles.detailMapAddress}>{address}</Text>
    </View>
  );
}
