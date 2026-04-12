import { BottomCard } from '@/components/bottom-card/bottom-card';
import { ComplaintMarkersLayer } from '@/components/map/complaint-markers-layer';
import { FabButton } from '@/components/floating-buttons/create-complaint-button';
import { CenterButton } from '@/components/floating-buttons/map-center-button';
import { SearchBar } from '@/components/search-bar/search-bar';
import { MAP_HIGHLIGHT_RADIUS_METERS } from '@/constants/map.constants';
import { useComplaints } from '@/context/ComplaintsContext';
import { useBottomCardAnimation } from '@/hooks/useBottomCardAnimation';
import { useColorScheme } from '@/hooks/useColorScheme.jsx';
import { useFloatingButtonsAnimation } from '@/hooks/useFloatingButtonsAnimation';
import { useLocation } from '@/hooks/useLocation.jsx';
import { useMapSearchAutocomplete } from '@/hooks/useMapSearchAutocomplete';
import { useNearbyComplaints } from '@/hooks/useNearbyComplaints';
import { useVisibleMapComplaints } from '@/hooks/useVisibleMapComplaints';
import { mapScreenStyles } from '@/styles/mapScreen';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Animated, Keyboard, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Circle } from 'react-native-maps';

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

  const nearestComplaint =
    nearbyComplaints && nearbyComplaints.length > 0
      ? nearbyComplaints[0]
      : null;

  const styles = mapScreenStyles(colorScheme);

  const centerOnUser = () => {
    mapRef.current?.animateToRegion(location, 500);
  };

  const { shouldShowComplaintMarkers, validComplaints } = useVisibleMapComplaints(
    allComplaints,
    region
  );

  const {
    searchText,
    suggestions,
    highlightedCoordinate,
    shouldRenderSuggestions,
    handleSearchTextChange,
    hideSuggestions,
    selectSuggestion,
  } = useMapSearchAutocomplete(validComplaints);

  const handleComplaintMarkerPress = useCallback(
    (complaintRouteId) => {
      if (complaintRouteId) {
        router.push(`/complaint/${complaintRouteId}`);
      }
    },
    [router]
  );

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
        onPress={hideSuggestions}
      >
        {highlightedCoordinate && (
          <Circle
            center={highlightedCoordinate}
            radius={MAP_HIGHLIGHT_RADIUS_METERS}
            strokeWidth={2}
            strokeColor="rgba(255,107,53,0.9)"
            fillColor="rgba(255,107,53,0.20)"
          />
        )}

        <ComplaintMarkersLayer
          complaints={validComplaints}
          shouldRender={shouldShowComplaintMarkers}
          onMarkerPress={handleComplaintMarkerPress}
        />
      </MapView>

      <SearchBar
        style={styles}
        value={searchText}
        onChangeText={handleSearchTextChange}
        showFilterBtn
      />

      {shouldRenderSuggestions && (
        <View style={styles.autocompleteContainer}>
          {suggestions.map((complaint, index) => {
            const complaintId = complaint?.id ?? complaint?._id;
            const itemKey = complaintId ? String(complaintId) : `suggestion-${index}`;

            return (
              <TouchableOpacity
                key={itemKey}
                style={[
                  styles.autocompleteItem,
                  index === suggestions.length - 1 ? styles.autocompleteItemLast : null,
                ]}
                activeOpacity={0.8}
                onPress={() => {
                  const nextRegion = selectSuggestion(complaint);
                  Keyboard.dismiss();

                  if (nextRegion) {
                    mapRef.current?.animateToRegion(nextRegion, 600);
                  }
                }}
              >
                <Text style={styles.autocompleteTitle} numberOfLines={1}>
                  {complaint.title}
                </Text>
                <Text style={styles.autocompleteSubtitle} numberOfLines={1}>
                  {complaint.type}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
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
