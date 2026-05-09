import { Marker, ViewAnnotation } from '@maplibre/maplibre-react-native';
import { View } from 'react-native';

export function UnifiedMarker({
  coordinate,
  anchor,
  draggable = false,
  onPress,
  onDragEnd,
  children,
}) {
  const lngLat = [
    Number(coordinate.longitude || 0),
    Number(coordinate.latitude || 0),
  ];

  const resolvedAnchor = anchor ? numericToAnchor(anchor) : 'bottom';

  if (draggable) {
    return (
      <ViewAnnotation
        lngLat={lngLat}
        anchor={resolvedAnchor}
        draggable
        onDragEnd={(event) => {
          if (!onDragEnd) return;
          const { lngLat: newLngLat } = event.nativeEvent;
          onDragEnd({
            nativeEvent: {
              coordinate: { latitude: newLngLat[1], longitude: newLngLat[0] },
            },
          });
        }}
      >
        {children || <View style={defaultPin} />}
      </ViewAnnotation>
    );
  }

  return (
    <Marker
      lngLat={lngLat}
      anchor={resolvedAnchor}
      onPress={() => onPress?.()}
    >
      {children || <View style={defaultPin} />}
    </Marker>
  );
}

function numericToAnchor(anchor) {
  if (anchor.y === 1) return 'bottom';
  if (anchor.y === 0) return 'top';
  if (anchor.x === 0) return 'left';
  if (anchor.x === 1) return 'right';
  return 'center';
}

const defaultPin = {
  width: 24,
  height: 24,
  borderRadius: 12,
  backgroundColor: '#E74C3C',
  borderWidth: 2,
  borderColor: '#fff',
};
