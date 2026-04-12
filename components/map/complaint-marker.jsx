import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Marker } from 'react-native-maps';
import { useColorScheme } from '@/hooks/useColorScheme';

export const ComplaintMarker = ({ complaint, onPress }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Define a cor baseada no tipo (seguindo seu layout)
  const getTheme = (type) => {
    switch (type?.toLowerCase()) {
      case 'abandono': return '#E74C3C'; // Vermelho
      case 'maus-tratos': return '#E67E22'; // Laranja
      case 'negligência': return '#1ABC9C'; // Verde/Turquesa
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
      anchor={{ x: 0.5, y: 1 }} // Point to bottom center
      tracksViewChanges={false} // Melhora performance
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
        {/* Triângulo indicador inferior */}
        <View style={[styles.arrow, { borderTopColor: themeColor }]} />
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    borderWidth: 2,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    position: 'relative',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 5,
    color: '#333',
  },
  arrow: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
});
