import { USE_MAPLIBRE, OPENFREEMAP_STYLE_URL } from '@/constants/map-provider.constants';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet } from 'react-native';

const MapLibreGL = USE_MAPLIBRE ? require('@maplibre/maplibre-react-native') : null;
const RNMaps = USE_MAPLIBRE ? null : require('react-native-maps');

export const UnifiedMapView = forwardRef(function UnifiedMapView(
  {
    style,
    initialRegion,
    region,
    showsUserLocation = false,
    showsMyLocationButton = false,
    scrollEnabled = true,
    zoomEnabled = true,
    rotateEnabled = true,
    pitchEnabled = true,
    onRegionChangeComplete,
    onPress,
    pointerEvents,
    children,
  },
  ref
) {
  const maplibreRef = useRef(null);
  const cameraRef = useRef(null);
  const rnmapsRef = useRef(null);

  useImperativeHandle(ref, () => ({
    animateToRegion: (rgn, duration = 500) => {
      if (USE_MAPLIBRE) {
        cameraRef.current?.setCamera({
          centerCoordinate: [rgn.longitude, rgn.latitude],
          zoomLevel: deltaToZoom(rgn.latitudeDelta),
          animationDuration: duration,
          animationMode: 'easeTo',
        });
      } else {
        rnmapsRef.current?.animateToRegion(rgn, duration);
      }
    },
  }));

  if (USE_MAPLIBRE) {
    const { MapView, Camera, UserLocation } = MapLibreGL;
    const center = initialRegion || region;

    return (
      <MapView
        ref={maplibreRef}
        style={style || styles.map}
        mapStyle={OPENFREEMAP_STYLE_URL}
        scrollEnabled={scrollEnabled}
        zoomEnabled={zoomEnabled}
        rotateEnabled={rotateEnabled}
        pitchEnabled={pitchEnabled}
        pointerEvents={pointerEvents}
        onPress={(event) => {
          if (!onPress) return;
          const { geometry } = event;
          onPress({
            nativeEvent: {
              coordinate: {
                latitude: geometry.coordinates[1],
                longitude: geometry.coordinates[0],
              },
            },
          });
        }}
        onRegionDidChange={(event) => {
          if (!onRegionChangeComplete) return;
          const { geometry, properties } = event;
          const [lng, lat] = geometry.coordinates;
          const zoom = properties.zoomLevel;
          const delta = zoomToDelta(zoom);
          onRegionChangeComplete({
            latitude: lat,
            longitude: lng,
            latitudeDelta: delta,
            longitudeDelta: delta,
          });
        }}
      >
        <Camera
          ref={cameraRef}
          defaultSettings={{
            centerCoordinate: center
              ? [center.longitude, center.latitude]
              : [0, 0],
            zoomLevel: center ? deltaToZoom(center.latitudeDelta) : 2,
          }}
        />
        {showsUserLocation && (
          <UserLocation visible animated showsUserHeadingIndicator />
        )}
        {children}
      </MapView>
    );
  }

  const NativeMapView = RNMaps.default;

  return (
    <NativeMapView
      ref={rnmapsRef}
      style={style || styles.map}
      initialRegion={initialRegion}
      region={region}
      showsUserLocation={showsUserLocation}
      showsMyLocationButton={showsMyLocationButton}
      scrollEnabled={scrollEnabled}
      zoomEnabled={zoomEnabled}
      rotateEnabled={rotateEnabled}
      pitchEnabled={pitchEnabled}
      pointerEvents={pointerEvents}
      onRegionChangeComplete={onRegionChangeComplete}
      onPress={onPress}
    >
      {children}
    </NativeMapView>
  );
});

function deltaToZoom(delta) {
  if (!delta || delta <= 0) return 14;
  return Math.round(Math.log2(360 / delta));
}

function zoomToDelta(zoom) {
  return 360 / Math.pow(2, zoom);
}

const styles = StyleSheet.create({
  map: { flex: 1 },
});
