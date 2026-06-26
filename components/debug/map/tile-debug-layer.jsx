import { buildDebugTiles } from '@/utils/map/map-marker-cache';
import { useMemo } from 'react';
import { Polygon } from 'react-native-maps';

const TILE_DEBUG_ENABLED = process.env.EXPO_PUBLIC_MAP_TILE_DEBUG === 'true';

export function TileDebugLayer({ visibleRegion, prefetchRegion, movement }) {
  const tiles = useMemo(
    () => buildDebugTiles({ visibleRegion, prefetchRegion, movement }),
    [movement, prefetchRegion, visibleRegion]
  );

  if (!__DEV__ || !TILE_DEBUG_ENABLED || tiles.length === 0) return null;

  return (
    <>
      {tiles.map((tile) => (
        <Polygon
          key={tile.key}
          coordinates={tile.coordinates}
          strokeColor={tile.active ? 'rgba(245, 158, 11, 0.95)' : 'rgba(245, 158, 11, 0.65)'}
          fillColor={tile.active ? 'rgba(39, 42, 58, 0.30)' : 'rgba(245, 158, 11, 0.12)'}
          strokeWidth={tile.active ? 2 : 1}
          tappable={false}
          zIndex={1}
        />
      ))}
    </>
  );
}
