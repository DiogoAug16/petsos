import { buildDebugTiles } from '@/utils/map/map-marker-cache';
import { useEffect, useMemo, useState } from 'react';
import { Polygon } from 'react-native-maps';

const TILE_DEBUG_ENABLED = process.env.EXPO_PUBLIC_MAP_TILE_DEBUG === 'true';
const TILE_DEBUG_UPDATE_MS = 300;

const getTilesKey = (tiles) => tiles.map((tile) => tile.key).join('|');

export function TileDebugLayer({ visibleRegion, prefetchRegion, movement }) {
  const nextTiles = useMemo(() => {
    if (!__DEV__ || !TILE_DEBUG_ENABLED) return [];
    return buildDebugTiles({ visibleRegion, prefetchRegion, movement });
  }, [movement, prefetchRegion, visibleRegion]);
  const [tiles, setTiles] = useState([]);

  useEffect(() => {
    if (!__DEV__ || !TILE_DEBUG_ENABLED) {
      setTiles([]);
      return;
    }

    const timer = setTimeout(() => {
      setTiles((currentTiles) => {
        if (getTilesKey(currentTiles) === getTilesKey(nextTiles)) {
          return currentTiles;
        }
        return nextTiles;
      });
    }, TILE_DEBUG_UPDATE_MS);

    return () => clearTimeout(timer);
  }, [nextTiles]);

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
