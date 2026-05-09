import { UnifiedMapView, UnifiedMarker } from '@/components/map/provider';
import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, View } from 'react-native';

export function DetailMapModal({ visible, location, mapRef, onClose, styles, theme }) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1 }}>
        <UnifiedMapView
          ref={mapRef}
          style={{ flex: 1 }}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          showsUserLocation
          showsMyLocationButton={false}
        >
          <UnifiedMarker coordinate={location} />
        </UnifiedMapView>

        <Pressable
          style={styles.detailMapModalButton}
          onPress={onClose}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </Pressable>
      </View>
    </Modal>
  );
}
