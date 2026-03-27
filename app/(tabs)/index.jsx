import { mapScreenStyles } from '@/components/styles/mapScreen.styles.jsx';
import { useColorScheme } from '@/components/useColorScheme.jsx';
import { useLocation } from '@/hooks/useLocation.jsx';
import { useRef } from 'react';
import { View } from 'react-native';
import MapView from 'react-native-maps';
import { BottomCard } from '@/components/bottom-card/bottom-card';
import { FabButton } from '@/components/floating-buttons/fab-button';
import { CenterButton } from '@/components/floating-buttons/map-center-button';
import { SearchBar } from '@/components/search-bar/search-bar';
import { MOCK_COMPLAINTS } from '@/mocks/mocks-complaints';

export default function MapScreen() {
  const { location } = useLocation();
  const colorScheme = useColorScheme() ?? 'light';
  const styles = mapScreenStyles(colorScheme);
  const mapRef = useRef(null);

  if (!location) return null;

  const nearestComplaint = MOCK_COMPLAINTS[0];

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

      <SearchBar />
      <CenterButton onPress={centerOnUser} />
      <FabButton onPress={() => console.log('Criar denúncia')} />
      <BottomCard complaint={nearestComplaint} />
    </View>
  );
}