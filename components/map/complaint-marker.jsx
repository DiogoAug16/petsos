import React, { memo, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Marker } from 'react-native-maps';
import { complaintMarkerStyles as styles } from '@/styles/mapScreen/complaint-marker.styles';

function ComplaintMarkerComponent({ complaint, onPress }) {
  const [tracksViewChanges, setTracksViewChanges] = useState(true);

  useEffect(() => {
    setTracksViewChanges(true);
    const timer = setTimeout(() => setTracksViewChanges(false), 700);
    return () => clearTimeout(timer);
  }, [complaint.id, complaint.type, complaint.animal]);

  const getTheme = (type) => {
    switch (type?.toLowerCase()) {
      case 'abandono':
        return {
          accent: '#E94B5F',
          soft: '#FFE2E7',
        };
      case 'maus-tratos':
      case 'maus-tratos fisicos':
        return {
          accent: '#FF8C42',
          soft: '#FFE8C8',
        };
      case 'negligência':
      case 'negligencia':
        return {
          accent: '#1A936F',
          soft: '#DDF7EC',
        };
      case 'perdido':
        return {
          accent: '#7C5CFF',
          soft: '#E9E0FF',
        };
      default:
        return {
          accent: '#FF9F1C',
          soft: '#FFE8C8',
        };
    }
  };

  const getAnimalIcon = (animal) => {
    switch (animal?.toLowerCase()) {
      case 'gato':
      case 'cat':
        return '🐱';
      case 'passaro':
      case 'pássaro':
      case 'bird':
        return '🐦';
      case 'cachorro':
      case 'dog':
        return '🐶';
      default:
        return '🐾';
    }
  };

  const theme = getTheme(complaint.type);
  const animalIcon = getAnimalIcon(complaint.animal);

  return (
    <Marker
      coordinate={{
        latitude: Number(complaint.location?.latitude || 0),
        longitude: Number(complaint.location?.longitude || 0),
      }}
      onPress={(event) => {
        event.stopPropagation?.();
        onPress?.();
      }}
      anchor={{ x: 0.5, y: 1 }}
      tracksViewChanges={tracksViewChanges}
    >
      <View style={styles.markerShell}>
        <View style={[styles.halo, { backgroundColor: theme.soft }]} />
        <View style={[styles.pin, { borderColor: theme.accent }]}>
          <View style={[styles.face, { backgroundColor: theme.soft }]}>
            <Text style={styles.markerEmoji}>{animalIcon}</Text>
          </View>
          <View style={styles.cheeks}>
            <View style={styles.cheek} />
            <View style={styles.cheek} />
          </View>
          <View style={[styles.statusDot, { backgroundColor: theme.accent }]} />
        </View>
        <View style={[styles.pointer, { backgroundColor: '#FFFFFF', borderColor: theme.accent }]} />
      </View>
    </Marker>
  );
}

export const ComplaintMarker = memo(ComplaintMarkerComponent);
