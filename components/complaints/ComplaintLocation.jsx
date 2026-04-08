import { Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { FORM_COLORS, formStyles } from '@/constants/FormStyles';

export default function ComplaintLocation({
  locationMode,
  location,
  manualLocation,
  onChangeLocationMode,
  onChangeManualLocation,
}) {
  const currentMapLocation = manualLocation || location;

  const renderLocationOption = (mode, icon, titleText, subtitle) => {
    const selected = locationMode === mode;

    return (
      <Pressable
        onPress={() => onChangeLocationMode(mode)}
        style={[
          styles.locationOption,
          selected && styles.locationOptionSelected,
        ]}
      >
        <View
          style={[
            styles.locationIcon,
            selected && { backgroundColor: FORM_COLORS.green },
          ]}
        >
          <Text style={styles.locationIconText}>{icon}</Text>
        </View>

        <View style={styles.locationContent}>
          <Text
            style={[
              styles.locationTitle,
              selected && { color: FORM_COLORS.green },
            ]}
          >
            {titleText}
          </Text>
          <Text style={styles.locationSubtitle}>{subtitle}</Text>
        </View>

        <View style={[styles.radio, selected && styles.radioSelected]}>
          {selected ? <View style={styles.radioInner} /> : null}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={formStyles.card}>
      <Text style={formStyles.label}>
        LOCALIZAÇÃO <Text style={formStyles.required}>*</Text>
      </Text>

      {renderLocationOption(
        'auto',
        '📍',
        'Usar localização atual',
        'Capturar automaticamente'
      )}

      {locationMode === 'auto' && location && (
        <View style={styles.previewContainer}>
          
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.002,
                longitudeDelta: 0.002,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
              rotateEnabled={false}
              pitchEnabled={false}
            >
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
              />
            </MapView>
          </View>

        
        </View>
      )}

      {renderLocationOption(
        'map',
        '🗺️',
        'Marcar no mapa',
        'Ajustar manualmente o local da ocorrência'
      )}

      {locationMode === 'map' && currentMapLocation && (
        <View style={styles.previewContainer}>
          

          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: currentMapLocation.latitude,
                longitude: currentMapLocation.longitude,
                latitudeDelta: 0.002,
                longitudeDelta: 0.002,
              }}
              onPress={(event) => {
                const coords = event.nativeEvent.coordinate;
                onChangeManualLocation(coords);
              }}
            >
              <Marker
                coordinate={currentMapLocation}
                draggable
                onDragEnd={(event) => {
                  onChangeManualLocation(event.nativeEvent.coordinate);
                }}
              />
            </MapView>
          </View>

        </View>
      )}

      {locationMode === 'map' && !currentMapLocation && (
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Aguardando localização inicial para abrir o mapa.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  locationOption: {
    backgroundColor: FORM_COLORS.background,
    borderRadius: 12,
    padding: 12,
    borderWidth: 0.5,
    borderColor: FORM_COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  locationOptionSelected: {
    borderWidth: 1.5,
    borderColor: FORM_COLORS.green,
    backgroundColor: 'rgba(26,147,111,0.06)',
  },
  locationIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: FORM_COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationIconText: {
    fontSize: 16,
  },
  locationContent: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: FORM_COLORS.text,
  },
  locationSubtitle: {
    fontSize: 11,
    color: FORM_COLORS.muted,
    marginTop: 2,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: FORM_COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    backgroundColor: FORM_COLORS.green,
    borderColor: FORM_COLORS.green,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  previewContainer: {
    //marginTop: 8,
   // marginBottom: 8,
    //padding: 10,
   // borderRadius: 12,
    //backgroundColor: 'rgba(26,147,111,0.06)',
  },
  previewTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: FORM_COLORS.green,
    marginBottom: 8,
  },
  mapContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  map: {
    width: '100%',
    height: 220,
  },
  coordinatesText: {
    fontSize: 12,
    color: FORM_COLORS.text,
    marginTop: 2,
  },
  infoBox: {
    marginTop: 8,
    padding: 10,
    borderRadius: 10,
    backgroundColor: FORM_COLORS.background,
    borderWidth: 0.5,
    borderColor: FORM_COLORS.border,
  },
  infoText: {
    fontSize: 12,
    color: FORM_COLORS.muted,
  },
});