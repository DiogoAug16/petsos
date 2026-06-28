import { BottomCard } from '@/components/bottom-card/bottom-card';
import { CenterButton } from '@/components/floating-buttons/map-center-button';
import { AutocompleteSuggestions } from '@/components/map/search/autocomplete-suggestions';
import { ComplaintsFilter } from '@/components/map/search/complaints-filter';
import { MapCanvas } from '@/components/map/canvas/map-canvas';
import { MapComplaintPreview } from '@/components/map/overlays/map-complaint-preview';
import { NoResultsBadge } from '@/components/map/overlays/no-results-badge';
import { SearchBar } from '@/components/search-bar/search-bar';
import { useBottomCardAnimation } from '@/hooks/ui/useBottomCardAnimation';
import { useColorScheme } from '@/hooks/ui/useColorScheme.jsx';
import { useFloatingButtonsAnimation } from '@/hooks/ui/useFloatingButtonsAnimation';
import { useLocation } from '@/hooks/map/useLocation.jsx';
import { useMapComplaintSelection } from '@/hooks/map/useMapComplaintSelection';
import { useMapFocusRegion } from '@/hooks/map/useMapFocusRegion';
import { useMapHandlers } from '@/hooks/map/useMapHandlers';
import { useMapComplaints } from '@/hooks/map/useMapComplaints';
import { useMapSearchAutocomplete } from '@/hooks/map/useMapSearchAutocomplete';
import { useMapTypeFilter } from '@/hooks/map/useMapTypeFilter';
import { useNearbyComplaints } from '@/hooks/map/useNearbyComplaints';
import { usePredictiveMapRegion } from '@/hooks/map/usePredictiveMapRegion';
import { mapScreenStyles } from '@/styles/mapScreen';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Animated, View } from 'react-native';

export default function MapScreen() {
  const router = useRouter();
  const { focusLat, focusLng } = useLocalSearchParams();
  const { location } = useLocation();
  const colorScheme = useColorScheme();
  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const { visibleRegion, prefetchRegion, movement, updateRegion } =
    usePredictiveMapRegion();

  const { translateY: buttonsTranslateY, animateTo } = useFloatingButtonsAnimation();

  const animation = useBottomCardAnimation(160, animateTo);

  const { nearbyComplaints, refetchNearby } = useNearbyComplaints(location, 5);
  const { focusCoordinate } = useMapFocusRegion({
    focusLat,
    focusLng,
    mapReady,
    mapRef,
    onFocus: refetchNearby,
  });

  const styles = mapScreenStyles(colorScheme);

  const centerOnUser = () => {
    mapRef.current?.animateToRegion(location, 500);
  };

  const {
    isPreviewVisible,
    routeComplaintId,
    routeCoordinates,
    routeRenderKey,
    routeLoadingComplaintId,
    selectedComplaint,
    selectedCoordinate,
    clearSelectedComplaint,
    openSelectedComplaintDetails,
    selectMapComplaint,
    showSelectedRoute,
  } = useMapComplaintSelection({ location, mapRef, router });

  const {
    complaints: mapComplaints,
    tileHints,
    shouldShowComplaintMarkers,
  } = useMapComplaints({
    visibleRegion: visibleRegion ?? location,
    prefetchRegion: prefetchRegion ?? location,
    movement,
  });

  const {
    selectedType,
    appliedType,
    isFilterOpen,
    filteredComplaints,
    hasNoFilteredResults,
    setSelectedType,
    applyTypeFilter,
    clearTypeFilter,
    toggleFilter,
    closeFilter,
  } = useMapTypeFilter(mapComplaints);

  const {
    searchText,
    suggestions,
    highlightedCoordinate,
    shouldRenderSuggestions,
    handleSearchTextChange,
    hideSuggestions,
    selectSuggestion,
  } = useMapSearchAutocomplete(filteredComplaints);

  const nearestComplaint =
    nearbyComplaints && nearbyComplaints.length > 0 ? nearbyComplaints[0] : null;

  const {
    handleComplaintMarkerPress,
    handleMapPress,
    handleToggleFilter,
    handleApplyFilter,
    handleClearFilter,
  } = useMapHandlers({
    hideSuggestions,
    closeFilter,
    selectComplaint: selectMapComplaint,
    toggleFilter,
    applyTypeFilter,
    clearTypeFilter,
  });

  if (!location) return null;

  return (
    <View style={styles.container}>
      <MapCanvas
        filteredComplaints={filteredComplaints}
        focusCoordinate={focusCoordinate}
        highlightedCoordinate={highlightedCoordinate}
        location={location}
        mapRef={mapRef}
        movement={movement}
        onMapPress={handleMapPress}
        onMarkerPress={handleComplaintMarkerPress}
        onReady={() => {
          setMapReady(true);
          updateRegion(location, { immediate: true });
        }}
        prefetchRegion={prefetchRegion}
        routeCoordinates={routeCoordinates}
        routeRenderKey={routeRenderKey}
        selectedCoordinate={selectedCoordinate}
        shouldShowComplaintMarkers={shouldShowComplaintMarkers}
        styles={styles}
        tileHints={appliedType ? [] : tileHints}
        updateRegion={updateRegion}
        visibleRegion={visibleRegion}
      />

      <SearchBar
        style={styles}
        value={searchText}
        onChangeText={handleSearchTextChange}
        showFilterBtn
        onFilterPress={handleToggleFilter}
        filterActive={Boolean(appliedType)}
      />

      <ComplaintsFilter
        style={styles}
        visible={isFilterOpen}
        selectedType={selectedType}
        onSelectType={setSelectedType}
        onApply={handleApplyFilter}
        onClear={handleClearFilter}
      />

      {Boolean(appliedType) && hasNoFilteredResults && !isFilterOpen && (
        <NoResultsBadge
          styles={styles}
          message="Nenhuma denúncia encontrada para o tipo selecionado."
        />
      )}

      {shouldRenderSuggestions && !isFilterOpen && (
        <AutocompleteSuggestions
          styles={styles}
          suggestions={suggestions}
          selectSuggestion={selectSuggestion}
          mapRef={mapRef}
        />
      )}

      {selectedComplaint && isPreviewVisible && !isFilterOpen && (
        <MapComplaintPreview
          complaint={selectedComplaint}
          styles={styles}
          onClose={clearSelectedComplaint}
          onDetails={openSelectedComplaintDetails}
          onRoute={showSelectedRoute}
          routeActive={
            routeCoordinates.length > 1 &&
            routeComplaintId === (selectedComplaint.id ?? selectedComplaint._id)
          }
          routeLoading={
            routeLoadingComplaintId ===
            (selectedComplaint.id ?? selectedComplaint._id)
          }
        />
      )}

      <Animated.View style={{ transform: [{ translateY: buttonsTranslateY }] }}>
        <CenterButton style={styles.centerBtn} onPress={centerOnUser} />
      </Animated.View>

      <BottomCard style={styles} complaint={nearestComplaint} animation={animation} />
    </View>
  );
}
