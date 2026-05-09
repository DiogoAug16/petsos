import { GeoJSONSource, Layer } from '@maplibre/maplibre-react-native';

export function UnifiedCircle({
  center,
  radius,
  strokeWidth = 2,
  strokeColor = 'rgba(255,107,53,0.9)',
  fillColor = 'rgba(255,107,53,0.20)',
}) {
  if (!center) return null;

  const polygon = createCirclePolygon(center, radius);

  return (
    <GeoJSONSource id="highlight-circle" data={polygon}>
      <Layer
        id="highlight-circle-fill"
        type="fill"
        paint={{
          'fill-color': fillColor,
          'fill-opacity': 1,
        }}
      />
      <Layer
        id="highlight-circle-stroke"
        type="line"
        paint={{
          'line-color': strokeColor,
          'line-width': strokeWidth,
        }}
      />
    </GeoJSONSource>
  );
}

function createCirclePolygon(center, radiusMeters, steps = 64) {
  const coords = [];
  const lat = center.latitude;
  const lng = center.longitude;

  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * 2 * Math.PI;
    const dx = radiusMeters * Math.cos(angle);
    const dy = radiusMeters * Math.sin(angle);
    const newLat = lat + (dy / 111320);
    const newLng = lng + (dx / (111320 * Math.cos((lat * Math.PI) / 180)));
    coords.push([newLng, newLat]);
  }

  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [coords],
    },
    properties: {},
  };
}
