import { OPENFREEMAP_STYLE_URL } from '@/constants/map-provider.constants';
import { Map, Camera, UserLocation } from '@maplibre/maplibre-react-native';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet } from 'react-native';

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
      cameraRef.current?.easeTo({
        center: [rgn.longitude, rgn.latitude],
        zoom: deltaToZoom(rgn.latitudeDelta),
        duration,
      });
    },
  }));

  const center = initialRegion || region;

  return (
    <Map
      style={style || styles.map}
      mapStyle={OPENFREEMAP_STYLE_URL}
      dragPan={scrollEnabled}
      touchZoom={zoomEnabled}
      touchRotate={rotateEnabled}
      touchPitch={pitchEnabled}
      pointerEvents={pointerEvents}
      onPress={(event) => {
        if (!onPress) return;
        const { lngLat } = event.nativeEvent;
        if (lngLat) {
          onPress({
            nativeEvent: {
              coordinate: {
                latitude: lngLat[1],
                longitude: lngLat[0],
              },
            },
          });
        }
      }}
      onRegionDidChange={(event) => {
        if (!onRegionChangeComplete) return;
        const { center: c, zoom } = event.nativeEvent;
        const delta = zoomToDelta(zoom);
        onRegionChangeComplete({
          latitude: c[1],
          longitude: c[0],
          latitudeDelta: delta,
          longitudeDelta: delta,
        });
      }}
    >
      <Camera
        ref={cameraRef}
        initialViewState={
          center
            ? {
                center: [center.longitude, center.latitude],
                zoom: deltaToZoom(center.latitudeDelta),
              }
            : undefined
        }
      />
      {showsUserLocation && <UserLocation visible animated />}
      {children}
    </Map>
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
