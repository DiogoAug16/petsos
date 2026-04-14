import { BottomCard } from '@/components/bottom-card/bottom-card';
import { FiltroDenuncias } from '@/components/map/filtro-denuncias';
import { ComplaintMarkersLayer } from '@/components/map/complaint-markers-layer';
import { FabButton } from '@/components/floating-buttons/create-complaint-button';
import { CenterButton } from '@/components/floating-buttons/map-center-button';
import { SearchBar } from '@/components/search-bar/search-bar';
import { NoResultsBadge } from '@/components/map/no-results-badge';
import { AutocompleteSuggestions } from '@/components/map/autocomplete-suggestions';
import { HighlightedCircle } from '@/components/map/highlighted-circle';
import { useMapHandlers } from '@/hooks/useMapHandlers';
import { useComplaints } from '@/context/ComplaintsContext';
import { useBottomCardAnimation } from '@/hooks/useBottomCardAnimation';
import { useColorScheme } from '@/hooks/useColorScheme.jsx';
import { useFloatingButtonsAnimation } from '@/hooks/useFloatingButtonsAnimation';
import { useLocation } from '@/hooks/useLocation.jsx';
import { useMapSearchAutocomplete } from '@/hooks/useMapSearchAutocomplete';
import { useMapTypeFilter } from '@/hooks/useMapTypeFilter';
import { useNearbyComplaints } from '@/hooks/useNearbyComplaints';
import { useVisibleMapComplaints } from '@/hooks/useVisibleMapComplaints';
import { mapScreenStyles } from '@/styles/mapScreen';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Animated, View } from 'react-native';
import MapView from 'react-native-maps';

export default function MapScreen() {
  const router = useRouter();
  const { location } = useLocation();
  const colorScheme = useColorScheme();
  const mapRef = useRef(null);
  const [region, setRegion] = useState(null);
  const { data: allComplaints = [], refetchSilent } = useComplaints();

  const { translateY: buttonsTranslateY, animateTo } =
    useFloatingButtonsAnimation();

  const animation = useBottomCardAnimation(160, animateTo);

  const { nearbyComplaints, refetchNearby } = useNearbyComplaints(location, 5);

  useFocusEffect(
    useCallback(() => {
      refetchNearby();
      refetchSilent();
    }, [refetchNearby, refetchSilent])
  );

  const styles = mapScreenStyles(colorScheme);

  const centerOnUser = () => {
    mapRef.current?.animateToRegion(location, 500);
  };

  const { shouldShowComplaintMarkers, validComplaints } = useVisibleMapComplaints(
    allComplaints,
    region
  );

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
  } = useMapTypeFilter(validComplaints);

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
    nearbyComplaints && nearbyComplaints.length > 0
      ? nearbyComplaints[0]
      : null;

  const {
    handleComplaintMarkerPress,
    handleMapPress,
    handleToggleFilter,
    handleApplyFilter,
    handleClearFilter,
  } = useMapHandlers({
    router,
    hideSuggestions,
    closeFilter,
    toggleFilter,
    applyTypeFilter,
    clearTypeFilter,
  });

  if (!location) return null;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={location}
        showsUserLocation
        showsMyLocationButton={false}
        onRegionChangeComplete={setRegion}
        onPress={handleMapPress}
      >
        <HighlightedCircle coordinate={highlightedCoordinate} />

        <ComplaintMarkersLayer
          key={appliedType ?? 'all'}
          complaints={filteredComplaints}
          shouldRender={shouldShowComplaintMarkers}
          onMarkerPress={handleComplaintMarkerPress}
        />
      </MapView>

      <SearchBar
        style={styles}
        value={searchText}
        onChangeText={handleSearchTextChange}
        showFilterBtn
        onFilterPress={handleToggleFilter}
        filterActive={Boolean(appliedType)}
      />

      <FiltroDenuncias
        style={styles}
        visible={isFilterOpen}
        selectedType={selectedType}
        onSelectType={setSelectedType}
        onApply={handleApplyFilter}
        onClear={handleClearFilter}
      />

      {Boolean(appliedType) && hasNoFilteredResults && !isFilterOpen && (
        <NoResultsBadge styles={styles} message="Nenhuma denúncia encontrada para o tipo selecionado." />
      )}

      {shouldRenderSuggestions && !isFilterOpen && (
        <AutocompleteSuggestions
          styles={styles}
          suggestions={suggestions}
          selectSuggestion={selectSuggestion}
          mapRef={mapRef}
        />
      )}

      <Animated.View style={{ transform: [{ translateY: buttonsTranslateY }] }}>
        <CenterButton style={styles.centerBtn} onPress={centerOnUser} />

        <FabButton
          style={styles.fab}
        />
      </Animated.View>

      <BottomCard
        style={styles}
        complaint={nearestComplaint}
        animation={animation}
      />
    </View>
  );
}
