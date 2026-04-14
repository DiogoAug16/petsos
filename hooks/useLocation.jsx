import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export const useLocation = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    let subscription;

    const getLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            
            if (status !== 'granted') return;

            const currentLocation = await Location.getCurrentPositionAsync({
              accuracy: Location.LocationAccuracy.Highest,
            });

            setLocation({
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });

        } catch (error) {
            console.error('Erro ao obter localização:', error);
        }
    };

    getLocation();

    return () => subscription?.remove();
  }, []);

  return { location };
};