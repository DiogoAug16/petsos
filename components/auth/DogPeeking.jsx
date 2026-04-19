import { View } from 'react-native';
import { Image } from 'expo-image';
import { styles } from '@/styles/auth/dog-peeking.styles';

export default function DogPeeking() {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/pets/dog-peeking.png')}
        style={styles.image}
        contentFit="contain"
        priority="high"
      />
    </View>
  );
}
