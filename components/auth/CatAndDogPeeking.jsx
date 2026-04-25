import { View} from 'react-native';
import { Image } from 'expo-image';
import { loginCatPeekingStyles as catStyles, loginDogPeekingStyles as dogStyles } from '@/styles/auth';
export default function CatAndDogPeeking() {
  return (
    <>
      <View style={catStyles.container}>
        <Image
          source={require('@/assets/images/pets/cat-peeking.png')}
          style={catStyles.image}
          contentFit="contain"
          priority="high"
        />
      </View>
      <View style={dogStyles.container}>
        <Image
          source={require('@/assets/images/pets/dog-peeking-looking-left.png')}
          style={dogStyles.image}
          contentFit="contain"
          priority="high"
        />
      </View>
    </>
  );
}

