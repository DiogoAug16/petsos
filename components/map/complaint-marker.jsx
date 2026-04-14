import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { Marker } from 'react-native-maps';
import { useColorScheme } from '@/hooks/useColorScheme';
import { complaintMarkerStyles as styles } from '@/styles/mapScreen/complaint-marker.styles';

export const ComplaintMarker = ({ complaint, onPress }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getTheme = (type) => {
    switch (type?.toLowerCase()) {
      case 'abandono': return '#E74C3C';
      case 'maus-tratos': return '#E67E22';
      case 'negligência': return '#1ABC9C';
      default: return '#E67E22';
    }
  };

  const themeColor = getTheme(complaint.type);

  return (
    <Marker
      coordinate={{
        latitude: Number(complaint.location?.latitude || 0),
        longitude: Number(complaint.location?.longitude || 0),
      }}
      title={complaint.title}
      description={complaint.type}
      onPress={onPress}
      anchor={{ x: 0.5, y: 1 }}
      tracksViewChanges={false}
    >
      <View
        style={[
          styles.container,
          {
            borderColor: themeColor,
            backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
            shadowOpacity: isDark ? 0.4 : 0.2,
          },
        ]}
      >
        <MaterialCommunityIcons 
          name={complaint.animal === 'Gato' ? 'cat' : 'dog'} 
          size={16} 
          color={themeColor} 
        />
        <Text style={[styles.label, { color: isDark ? '#F2F2F7' : '#333333' }]} numberOfLines={1}>
          {complaint.title}
        </Text>
        <View style={[styles.arrow, { borderTopColor: themeColor }]} />
      </View>
    </Marker>
  );
};
