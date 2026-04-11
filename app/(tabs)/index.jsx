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
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Animated, View } from 'react-native';
import MapView from 'react-native-maps';

import { ComplaintMarker } from '@/components/map/complaint-marker';
import { getComplaints } from '@/services/complaints.service';

export default function MapScreen() {
  const router = useRouter();
  const { location } = useLocation();
  const colorScheme = useColorScheme();
  const mapRef = useRef(null);
  const [allComplaints, setAllComplaints] = useState([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoadingComplaints(true);
        const data = await getComplaints();
        const complaints = Array.isArray(data) ? data : [];
        setAllComplaints(complaints);
      } catch (error) {
        console.error('Erro ao carregar denúncias:', error);
        Alert.alert('Erro', 'Falha ao carregar denúncias.');
      } finally {
        setLoadingComplaints(false);
      }
    };
    fetchAll();
  }, []);

  const { translateY: buttonsTranslateY, animateTo } =
    useFloatingButtonsAnimation();

  const animation = useBottomCardAnimation(160, animateTo);

  const { nearbyComplaints, refetchNearby } = useNearbyComplaints(location, 5);

  useFocusEffect(
    useCallback(() => {
      refetchNearby();
    }, [location])
  );

  useEffect(() => {
    if (allComplaints.length > 0 && mapRef.current && location) {
      mapRef.current.fitToCoordinates(
        allComplaints
          .map(c => ({
            latitude: Number(c.location?.latitude),
            longitude: Number(c.location?.longitude),
          }))
          .filter(coord => coord.latitude && coord.longitude),
        {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        }
      );
    }
  }, [allComplaints, location]);

  const nearestComplaint =
    nearbyComplaints && nearbyComplaints.length > 0
      ? nearbyComplaints[0]
      : null;

  if (!location) return null;

  const styles = mapScreenStyles(colorScheme);

  const centerOnUser = () => {
    mapRef.current?.animateToRegion(location, 500);
  };

  const validComplaints = allComplaints.filter(
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
      >
        {validComplaints.map(complaint => (
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