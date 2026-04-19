import { View } from 'react-native';
import { Image } from 'expo-image';
import { dogPeekingStyles as styles } from '@/styles/auth';

export default function DogPeeking() {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/pets/dog-peeking-3.png')}
        style={styles.image}
        contentFit="contain"
        priority="high"
      />
    </View>
  );
}
