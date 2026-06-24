import { BottomCard } from '@/components/bottom-card/bottom-card';
import { CenterButton } from '@/components/floating-buttons/map-center-button';
import { AutocompleteSuggestions } from '@/components/map/autocomplete-suggestions';
import { ComplaintMarkersLayer } from '@/components/map/complaint-markers-layer';
import { ComplaintsFilter } from '@/components/map/complaints-filter';
import { HighlightedCircle } from '@/components/map/highlighted-circle';
import { MapComplaintPreview } from '@/components/map/map-complaint-preview';
import { NoResultsBadge } from '@/components/map/no-results-badge';
import { SearchBar } from '@/components/search-bar/search-bar';
import { useBottomCardAnimation } from '@/hooks/useBottomCardAnimation';
import { useColorScheme } from '@/hooks/useColorScheme.jsx';
import { useFloatingButtonsAnimation } from '@/hooks/useFloatingButtonsAnimation';
import { useLocation } from '@/hooks/useLocation.jsx';
import { useMapHandlers } from '@/hooks/useMapHandlers';
import { useMapComplaints } from '@/hooks/useMapComplaints';
import { useMapSearchAutocomplete } from '@/hooks/useMapSearchAutocomplete';
import { useMapTypeFilter } from '@/hooks/useMapTypeFilter';
import { useNearbyComplaints } from '@/hooks/useNearbyComplaints';
import { getDrivingRoute } from '@/services/routes.service';
import { mapScreenStyles } from '@/styles/mapScreen';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, View } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';

export default function MapScreen() {
  const router = useRouter();
  const { focusLat, focusLng } = useLocalSearchParams();
  const { location } = useLocation();
  const colorScheme = useColorScheme();
  const mapRef = useRef(null);
  const routeRequestRef = useRef(0);
  const [region, setRegion] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [routeComplaintId, setRouteComplaintId] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  const { translateY: buttonsTranslateY, animateTo } =
    useFloatingButtonsAnimation();

  const animation = useBottomCardAnimation(160, animateTo);

  const { nearbyComplaints, refetchNearby } = useNearbyComplaints(location, 5);
  const focusRegion = useMemo(() => {
    const latitude = Number(Array.isArray(focusLat) ? focusLat[0] : focusLat);
    const longitude = Number(Array.isArray(focusLng) ? focusLng[0] : focusLng);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
    return {
      latitude,
      longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };
  }, [focusLat, focusLng]);

  const focusCoordinate = focusRegion
    ? { latitude: focusRegion.latitude, longitude: focusRegion.longitude }
    : null;

  const focusMapOnComplaint = useCallback(() => {
    if (!focusRegion || !mapReady) return;
    mapRef.current?.animateToRegion(focusRegion, 600);
  }, [focusRegion, mapReady]);

  useFocusEffect(
    useCallback(() => {
      refetchNearby();
      const timer = setTimeout(focusMapOnComplaint, 80);
      return () => clearTimeout(timer);
    }, [focusMapOnComplaint, refetchNearby])
  );

  const styles = mapScreenStyles(colorScheme);

  const centerOnUser = () => {
    mapRef.current?.animateToRegion(location, 500);
  };

  const selectedCoordinate = useMemo(() => {
    const latitude = Number(selectedComplaint?.location?.latitude);
    const longitude = Number(selectedComplaint?.location?.longitude);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
    return { latitude, longitude };
  }, [selectedComplaint]);

  const selectMapComplaint = useCallback((complaint) => {
    routeRequestRef.current += 1;
    setSelectedComplaint(complaint);

    const latitude = Number(complaint?.location?.latitude);
    const longitude = Number(complaint?.location?.longitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;

    mapRef.current?.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    }, 450);
  }, []);

  const clearSelectedComplaint = useCallback(() => {
    routeRequestRef.current += 1;
    setSelectedComplaint((current) =>
      current ? { ...current, __previewHidden: true } : null
    );
  }, []);

  const showSelectedRoute = useCallback(async () => {
    if (!selectedComplaint || !selectedCoordinate) return;

    const selectedComplaintId = selectedComplaint.id ?? selectedComplaint._id;
    if (!selectedComplaintId) return;

    if (routeComplaintId && routeComplaintId === selectedComplaintId) {
      routeRequestRef.current += 1;
      setRouteComplaintId(null);
      setRouteCoordinates([]);
      return;
    }

    const requestId = routeRequestRef.current + 1;
    routeRequestRef.current = requestId;
    const start = { latitude: location.latitude, longitude: location.longitude };
    let nextRoute = [start, selectedCoordinate];

    try {
      const route = await getDrivingRoute(start, selectedCoordinate);
      if (route?.length > 1) {
        nextRoute = route;
      }
    } catch (error) {
      console.warn('OpenRouteService route failed', error?.message);
    }

    if (requestId !== routeRequestRef.current) return;

    setRouteComplaintId(selectedComplaintId);
    setRouteCoordinates(nextRoute);
    mapRef.current?.fitToCoordinates(
      nextRoute,
      {
        edgePadding: { top: 120, right: 64, bottom: 260, left: 64 },
        animated: true,
      },
    );
  }, [location, routeComplaintId, selectedComplaint, selectedCoordinate]);

  const openSelectedComplaintDetails = useCallback(() => {
    const complaintId = selectedComplaint?.id ?? selectedComplaint?._id;
    if (complaintId) router.push(`/complaint/${complaintId}`);
  }, [router, selectedComplaint]);

  useEffect(() => {
    focusMapOnComplaint();
  }, [focusMapOnComplaint]);

  const {
    complaints: mapComplaints,
    shouldShowComplaintMarkers,
  } = useMapComplaints(region ?? location);

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
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={location}
        showsUserLocation
        showsMyLocationButton={false}
        onMapReady={() => setMapReady(true)}
        onRegionChangeComplete={setRegion}
        onPress={handleMapPress}
      >
        <HighlightedCircle
          coordinate={selectedCoordinate ?? focusCoordinate ?? highlightedCoordinate}
        />

        {routeCoordinates.length > 1 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#FF9F1C"
            strokeWidth={5}
          />
        )}

        <ComplaintMarkersLayer
          key={`${mapReady ? 'ready' : 'loading'}-${appliedType ?? 'all'}-${filteredComplaints.length}`}
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

      <ComplaintsFilter
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

      {selectedComplaint && !selectedComplaint.__previewHidden && !isFilterOpen && (
        <MapComplaintPreview
          complaint={selectedComplaint}
          styles={styles}
          onClose={clearSelectedComplaint}
          onDetails={openSelectedComplaintDetails}
          onRoute={showSelectedRoute}
          routeActive={routeComplaintId === (selectedComplaint.id ?? selectedComplaint._id)}
        />
      )}

      <Animated.View style={{ transform: [{ translateY: buttonsTranslateY }] }}>
        <CenterButton style={styles.centerBtn} onPress={centerOnUser} />
      </Animated.View>

      <BottomCard
        style={styles}
        complaint={nearestComplaint}
        animation={animation}
      />
    </View>
  );
}
