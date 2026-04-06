import { BottomCard } from '@/components/bottom-card/bottom-card';
import { useBottomCardAnimation } from '@/hooks/useBottomCardAnimation';
import { FabButton } from '@/components/floating-buttons/create-complaint-button';
import { CenterButton } from '@/components/floating-buttons/map-center-button';
import { SearchBar } from '@/components/search-bar/search-bar';
import { useColorScheme } from '@/hooks/useColorScheme.jsx';
import { useComplaints } from '@/context/ComplaintsContext';
import { useFloatingButtonsAnimation } from '@/hooks/useFloatingButtonsAnimation';
import { useLocation } from '@/hooks/useLocation.jsx';
import { mapScreenStyles } from '@/styles/mapScreen.styles.jsx';
import { useRef } from 'react';
import { Animated, View } from 'react-native';
import MapView from 'react-native-maps';

export default function MapScreen() {
  const { location } = useLocation();
  const colorScheme = useColorScheme();
  const { complaints } = useComplaints();
  const mapRef = useRef(null);
  const { translateY: buttonsTranslateY, animateTo } = useFloatingButtonsAnimation();
  const animation = useBottomCardAnimation(160, animateTo);

  if (!location) return null;

  const styles = mapScreenStyles(colorScheme);
  const nearestComplaint = complaints[0];

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
          onPress={() => {
            console.log('Botão de centralizar clicado');
            centerOnUser();
          }}
        />
        <FabButton style={styles.fab} onPress={() => console.log('Botao criar denuncia clicado')} />
      </Animated.View>

      <BottomCard style={styles} complaint={nearestComplaint} animation={animation} />
    </View>
  );
}