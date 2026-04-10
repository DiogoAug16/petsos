import { BottomCard } from '@/components/bottom-card/bottom-card';
import { FabButton } from '@/components/floating-buttons/create-complaint-button';
import { CenterButton } from '@/components/floating-buttons/map-center-button';
import { SearchBar } from '@/components/search-bar/search-bar';
import { useBottomCardAnimation } from '@/hooks/useBottomCardAnimation';
import { useColorScheme } from '@/hooks/useColorScheme.jsx';
import { useFloatingButtonsAnimation } from '@/hooks/useFloatingButtonsAnimation';
import { useLocation } from '@/hooks/useLocation.jsx';
import { useNearbyComplaints } from '@/hooks/useNearbyComplaints';
import { mapScreenStyles } from '@/styles/mapScreen';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef } from 'react';
import { Animated, View } from 'react-native';
import MapView from 'react-native-maps';

export default function MapScreen() {
  const { location } = useLocation();
  const colorScheme = useColorScheme();
  const mapRef = useRef(null);

  const { translateY: buttonsTranslateY, animateTo } =
    useFloatingButtonsAnimation();

  const animation = useBottomCardAnimation(160, animateTo);

  //  AQUI: pegar refetchNearby
  const { nearbyComplaints, refetchNearby } = useNearbyComplaints(location, 5);

  //  AQUI: atualizar ao voltar pra tela
  useFocusEffect(
    useCallback(() => {
      refetchNearby();
    }, [location])
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

      {nearestComplaint && (
        <BottomCard
          style={styles}
          complaint={nearestComplaint}
          animation={animation}
        />
      )}
    </View>
  );
}