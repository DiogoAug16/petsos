import { Circle } from 'react-native-maps';
import { MAP_HIGHLIGHT_RADIUS_METERS } from '@/constants/map.constants';

export function HighlightedCircle({ coordinate }) {
  if (!coordinate) return null;
  return (
    <Circle
      center={coordinate}
      radius={MAP_HIGHLIGHT_RADIUS_METERS}
      strokeWidth={2}
      strokeColor="rgba(255,107,53,0.9)"
      fillColor="rgba(255,107,53,0.20)"
    />
  );
}
