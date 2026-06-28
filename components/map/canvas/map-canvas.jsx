import MapView, { Polyline } from 'react-native-maps';

import { TileDebugLayer } from '@/components/debug/map/tile-debug-layer';
import { ComplaintMarkersLayer } from '@/components/map/markers/complaint-markers-layer';
import { TileHintLayer } from '@/components/map/markers/tile-hint-layer';
import { HighlightedCircle } from '@/components/map/overlays/highlighted-circle';

export function MapCanvas({
  filteredComplaints,
  focusCoordinate,
  highlightedCoordinate,
  location,
  mapRef,
  movement,
  onMapPress,
  onMarkerPress,
  onReady,
  prefetchRegion,
  routeCoordinates,
  routeRenderKey,
  selectedCoordinate,
  shouldShowComplaintMarkers,
  styles,
  tileHints,
  updateRegion,
  visibleRegion,
}) {
  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={location}
      showsUserLocation
      showsMyLocationButton={false}
      onMapReady={onReady}
      onRegionChange={(nextRegion) => updateRegion(nextRegion)}
      onRegionChangeComplete={(nextRegion) =>
        updateRegion(nextRegion, { immediate: true })
      }
      onPress={onMapPress}
    >
      <HighlightedCircle
        coordinate={selectedCoordinate ?? focusCoordinate ?? highlightedCoordinate}
      />

      <TileDebugLayer
        visibleRegion={visibleRegion ?? location}
        prefetchRegion={prefetchRegion ?? location}
        movement={movement}
      />

      <TileHintLayer
        tileHints={tileHints}
        shouldRender={shouldShowComplaintMarkers}
      />

      <ComplaintMarkersLayer
        complaints={filteredComplaints}
        shouldRender={shouldShowComplaintMarkers}
        onMarkerPress={onMarkerPress}
      />

      {routeCoordinates.length > 1 && (
        <Polyline
          key={`route-${routeRenderKey}`}
          coordinates={routeCoordinates}
          strokeColor="#FF9F1C"
          strokeWidth={5}
          zIndex={20}
          geodesic={false}
        />
      )}
    </MapView>
  );
}
