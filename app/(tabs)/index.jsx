import { BottomCard } from '@/components/bottom-card/bottom-card';
import { FabButton } from '@/components/floating-buttons/create-complaint-button';
import { CenterButton } from '@/components/floating-buttons/map-center-button';
import { SearchBar } from '@/components/search-bar/search-bar';
import { useBottomCardAnimation } from '@/hooks/useBottomCardAnimation';
import { useColorScheme } from '@/hooks/useColorScheme.jsx';
import { useFloatingButtonsAnimation } from '@/hooks/useFloatingButtonsAnimation';
import { useLocation } from '@/hooks/useLocation.jsx';
import { useNearbyComplaints } from '@/hooks/useNearbyComplaints';
import { useComplaintCarousel } from '@/hooks/useNearestComplaintsCarousel';
import { mapScreenStyles } from '@/styles/mapScreen';
import { useRef } from 'react';
import { Animated, View } from 'react-native';
import MapView from 'react-native-maps';

export default function MapScreen() {
  const { location } = useLocation();
  const colorScheme = useColorScheme();
  const mapRef = useRef(null);

  const { translateY: buttonsTranslateY, animateTo } =
    useFloatingButtonsAnimation();

  const animation = useBottomCardAnimation(160, animateTo);

  const { nearbyComplaints } = useNearbyComplaints(location, 5);
  const { currentComplaint } = useComplaintCarousel(nearbyComplaints);

  if (!location) return null;

  const styles = mapScreenStyles(colorScheme);

  const centerOnUser = () => {
    mapRef.current?.animateToRegion(location, 500);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={location}
        showsUserLocation
        showsMyLocationButton={false}
      />

      <SearchBar style={styles} showFilterBtn />

      <Animated.View style={{ transform: [{ translateY: buttonsTranslateY }] }}>
        <CenterButton
          style={styles.centerBtn}
          onPress={centerOnUser}
        />

        <FabButton
          style={styles.fab}
          onPress={() => console.log('Botao criar denuncia clicado')}
        />
      </Animated.View>

      {currentComplaint && (
        <BottomCard
          style={styles}
          complaint={currentComplaint}
          animation={animation}
        />
      )}
    </View>
  );
}