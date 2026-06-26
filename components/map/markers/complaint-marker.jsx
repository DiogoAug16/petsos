import React, { memo, useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Marker } from 'react-native-maps';
import { complaintMarkerStyles as styles } from '@/styles/mapScreen/complaint-marker.styles';

const TRACKS_VIEW_CHANGES_MS = 650;

const getComplaintId = (complaint) => complaint?.id ?? complaint?._id;

const areMarkerPropsEqual = (previous, next) => {
  const previousComplaint = previous.complaint;
  const nextComplaint = next.complaint;

  return (
    getComplaintId(previousComplaint) === getComplaintId(nextComplaint) &&
    previousComplaint?.type === nextComplaint?.type &&
    previousComplaint?.animal === nextComplaint?.animal &&
    previousComplaint?.status === nextComplaint?.status &&
    previousComplaint?.title === nextComplaint?.title &&
    previousComplaint?.updatedAt === nextComplaint?.updatedAt &&
    Number(previousComplaint?.location?.latitude) ===
      Number(nextComplaint?.location?.latitude) &&
    Number(previousComplaint?.location?.longitude) ===
      Number(nextComplaint?.location?.longitude) &&
    previous.complaintRouteId === next.complaintRouteId &&
    previous.onMarkerPress === next.onMarkerPress
  );
};

function ComplaintMarkerComponent({ complaint, complaintRouteId, onMarkerPress }) {
  const [tracksViewChanges, setTracksViewChanges] = useState(true);

  useEffect(() => {
    setTracksViewChanges(true);
    const timer = setTimeout(() => setTracksViewChanges(false), TRACKS_VIEW_CHANGES_MS);
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
  const handlePress = useCallback(
    (event) => {
      event.stopPropagation?.();
      onMarkerPress?.(complaint, complaintRouteId);
    },
    [complaint, complaintRouteId, onMarkerPress]
  );

  return (
    <Marker
      coordinate={{
        latitude: Number(complaint.location?.latitude || 0),
        longitude: Number(complaint.location?.longitude || 0),
      }}
      onPress={handlePress}
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

export const ComplaintMarker = memo(ComplaintMarkerComponent, areMarkerPropsEqual);
