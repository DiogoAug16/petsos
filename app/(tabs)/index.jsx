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
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, View } from 'react-native';

import MapView from 'react-native-maps';

import { ComplaintMarker } from '@/components/map/complaint-marker';
import { getComplaints } from '@/services/complaints.service';

export default function MapScreen() {
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
        console.log('Loaded complaints:', complaints.length, complaints[0]); // Debug
        setAllComplaints(complaints);
      } catch (error) {
        console.error("Erro ao carregar denúncias:", error);
        Alert.alert('Erro', 'Falha ao carregar denúncias.');
      } finally {
        setLoadingComplaints(false);
      }
    };
    fetchAll();
  }, []);

  const { translateY: buttonsTranslateY, animateTo } = useFloatingButtonsAnimation();
  const animation = useBottomCardAnimation(160, animateTo);

  const { nearbyComplaints } = useNearbyComplaints(location, 5);
  const { currentComplaint } = useComplaintCarousel(nearbyComplaints);

  useEffect(() => {
    if (allComplaints.length > 0 && mapRef.current && location) {
      // Fit map to include all markers
      const bounds = allComplaints
        .filter(c => c.location && c.location.latitude && c.location.longitude)
        .reduce((acc, c) => ({
          minLat: Math.min(acc.minLat, Number(c.location.latitude)),
          maxLat: Math.max(acc.maxLat, Number(c.location.latitude)),
          minLng: Math.min(acc.minLng, Number(c.location.longitude)),
          maxLng: Math.max(acc.maxLng, Number(c.location.longitude)),
        }), {
          minLat: location.latitude - 0.01,
          maxLat: location.latitude + 0.01,
          minLng: location.longitude - 0.01,
          maxLng: location.longitude + 0.01,
        });
      mapRef.current.fitToCoordinates(
        allComplaints.map(c => ({
          latitude: Number(c.location?.latitude),
          longitude: Number(c.location?.longitude),
        })).filter((coord, i) => coord.latitude && coord.longitude),
        {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        }
      );
    }
  }, [allComplaints, location]);

  if (!location) return null;

  const styles = mapScreenStyles(colorScheme);

  const centerOnUser = () => {
    mapRef.current?.animateToRegion(location, 500);
  };

  const validComplaints = allComplaints.filter(complaint => 
    complaint.location && 
    complaint.location.latitude && 
    complaint.location.longitude && 
    !isNaN(Number(complaint.location.latitude)) &&
    !isNaN(Number(complaint.location.longitude))
  );

  console.log('Valid markers to render:', validComplaints.length); // Debug

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={location}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {validComplaints.map((complaint) => (
          <ComplaintMarker 
            key={complaint.id || complaint._id} 
            complaint={complaint} 
          />
        ))}
      </MapView>

      <SearchBar style={styles} showFilterBtn />

      <Animated.View style={[styles.floatingButtonsContainer, { transform: [{ translateY: buttonsTranslateY }] }]}>
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
