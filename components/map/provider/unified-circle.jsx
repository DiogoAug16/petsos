import MapLibreGL from '@maplibre/maplibre-react-native';

const { ShapeSource, FillLayer, LineLayer } = MapLibreGL;

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
    <ShapeSource id="highlight-circle" shape={polygon}>
      <FillLayer
        id="highlight-circle-fill"
        style={{
          fillColor: fillColor,
          fillOpacity: 1,
        }}
      />
      <LineLayer
        id="highlight-circle-stroke"
        style={{
          lineColor: strokeColor,
          lineWidth: strokeWidth,
        }}
      />
    </ShapeSource>
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
