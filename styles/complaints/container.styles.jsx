import { StyleSheet } from 'react-native';

export const containerStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFF6EC',
    },
    complaintsBackgroundImage: {
      ...StyleSheet.absoluteFillObject,
      width: '100%',
      height: '100%',
    },
    topPanel: {
      backgroundColor: '#FFF6EC',
      paddingTop: 56,
      paddingBottom: 12,
    },
  });
};
