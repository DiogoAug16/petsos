import { BottomCard } from '@/components/bottom-card/bottom-card';
import { FabButton } from '@/components/floating-buttons/create-complaint-button';
import { CenterButton } from '@/components/floating-buttons/map-center-button';
import { SearchBar } from '@/components/search-bar/search-bar';
import { useComplaints } from '@/context/ComplaintsContext';
import { useBottomCardAnimation } from '@/hooks/useBottomCardAnimation';
import { useColorScheme } from '@/hooks/useColorScheme.jsx';
import { useFloatingButtonsAnimation } from '@/hooks/useFloatingButtonsAnimation';
import { useLocation } from '@/hooks/useLocation.jsx';
import { useNearbyComplaints } from '@/hooks/useNearbyComplaints';
import { mapScreenStyles } from '@/styles/mapScreen';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Animated, View } from 'react-native';
import MapView from 'react-native-maps';

import { ComplaintMarker } from '@/components/map/complaint-marker';

const CITY_LEVEL_MAX_DELTA = 0.22;

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

  if (!location) return null;

  const styles = mapScreenStyles(colorScheme);

  const centerOnUser = () => {
    mapRef.current?.animateToRegion(location, 500);
  };

  const shouldShowComplaintMarkers =
    !region ||
    (region.latitudeDelta <= CITY_LEVEL_MAX_DELTA &&
      region.longitudeDelta <= CITY_LEVEL_MAX_DELTA);

  const validComplaints = (Array.isArray(allComplaints) ? allComplaints : []).filter(
    complaint =>
      complaint.location &&
      complaint.location.latitude &&
      complaint.location.longitude &&
      !isNaN(Number(complaint.location.latitude)) &&
      !isNaN(Number(complaint.location.longitude))
  );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={location}
        showsUserLocation
        showsMyLocationButton={false}
        onRegionChangeComplete={setRegion}
      >
        {shouldShowComplaintMarkers &&
          validComplaints.map(complaint => (
            <ComplaintMarker
              key={complaint.id || complaint._id}
              complaint={complaint}
              onPress={() => router.push(`/complaint/${complaint.id || complaint._id}`)}
            />
          ))}
      </MapView>

      <SearchBar style={styles} showFilterBtn />

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
