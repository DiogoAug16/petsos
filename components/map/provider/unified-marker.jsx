import { USE_MAPLIBRE } from '@/constants/map-provider.constants';
import { View } from 'react-native';

const MapLibreGL = USE_MAPLIBRE ? require('@maplibre/maplibre-react-native') : null;
const RNMaps = USE_MAPLIBRE ? null : require('react-native-maps');

let markerCounter = 0;

export function UnifiedMarker({
  coordinate,
  title,
  description,
  anchor,
  draggable = false,
  tracksViewChanges = false,
  onPress,
  onDragEnd,
  children,
}) {
  if (USE_MAPLIBRE) {
    const { MarkerView, PointAnnotation } = MapLibreGL;
    const coord = [
      Number(coordinate.longitude || 0),
      Number(coordinate.latitude || 0),
    ];

    if (draggable) {
      const id = `marker-${markerCounter++}`;
      return (
        <PointAnnotation
          id={id}
          coordinate={coord}
          title={title}
          snippet={description}
          anchor={anchor || { x: 0.5, y: 1 }}
          draggable
          onSelected={() => onPress?.()}
          onDragEnd={(event) => {
            if (!onDragEnd) return;
            const [lng, lat] = event.geometry.coordinates;
            onDragEnd({
              nativeEvent: { coordinate: { latitude: lat, longitude: lng } },
            });
          }}
        >
          {children || <View style={defaultPin} />}
        </PointAnnotation>
      );
    }

    return (
      <MarkerView
        coordinate={coord}
        anchor={anchor || { x: 0.5, y: 1 }}
        allowOverlap
      >
        <View onStartShouldSetResponder={() => true} onResponderRelease={() => onPress?.()}>
          {children || <View style={defaultPin} />}
        </View>
      </MarkerView>
    );
  }

  const { Marker } = RNMaps;

  return (
    <Marker
      coordinate={{
        latitude: Number(coordinate.latitude || 0),
        longitude: Number(coordinate.longitude || 0),
      }}
      title={title}
      description={description}
      anchor={anchor}
      draggable={draggable}
      tracksViewChanges={tracksViewChanges}
      onPress={onPress}
      onDragEnd={onDragEnd}
    >
      {children}
    </Marker>
  );
}

const defaultPin = {
  width: 24,
  height: 24,
  borderRadius: 12,
  backgroundColor: '#E74C3C',
  borderWidth: 2,
  borderColor: '#fff',
};
