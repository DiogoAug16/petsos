import { OPENFREEMAP_STYLE_URL } from '@/constants/map-provider.constants';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet } from 'react-native';

const { MapView, Camera, UserLocation } = MapLibreGL;

export const UnifiedMapView = forwardRef(function UnifiedMapView(
  {
    style,
    initialRegion,
    region,
    showsUserLocation = false,
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
  const cameraRef = useRef(null);

  useImperativeHandle(ref, () => ({
    animateToRegion: (rgn, duration = 500) => {
      cameraRef.current?.setCamera({
        centerCoordinate: [rgn.longitude, rgn.latitude],
        zoomLevel: deltaToZoom(rgn.latitudeDelta),
        animationDuration: duration,
        animationMode: 'easeTo',
      });
    },
  }));

  const center = initialRegion || region;

  return (
    <MapView
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
