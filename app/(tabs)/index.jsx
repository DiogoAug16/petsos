import MapView from 'react-native-maps';
import { StyleSheet } from 'react-native';

import { useLocation } from '@/hooks/useLocation';

export default function MapScreen() {
  const { location } = useLocation();

  if (!location) return null;

  return (
    <MapView
      style={styles.map}
      initialRegion={location}
    />
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});