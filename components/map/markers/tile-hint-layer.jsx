import { Text, View } from 'react-native';
import { Marker } from 'react-native-maps';

import { tileHintMarkerStyles as styles } from '@/styles/mapScreen/tile-hint-marker.styles';

const MAX_TILE_HINTS = 80;

export function TileHintLayer({ shouldRender = false, tileHints = [] }) {
  if (!shouldRender || tileHints.length === 0) return null;

  return tileHints.slice(0, MAX_TILE_HINTS).map((hint) => (
    <Marker
      key={`tile-hint-${hint.key}`}
      coordinate={hint.coordinate}
      anchor={{ x: 0.5, y: 0.5 }}
      tracksViewChanges={false}
      zIndex={4}
    >
      <View
        style={styles.shell}
        accessible
        accessibilityRole="text"
        accessibilityLabel={`${hint.count} denúncias próximas`}
      >
        <View style={styles.softRing} />
        <Text style={styles.count}>{hint.count}</Text>
      </View>
    </Marker>
  ));
}
