import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

export default function LoginBottomSection({ colors, isDark }) {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/pets/pet-shield-transparent.webp')}
        style={styles.shieldImage}
        contentFit="contain"
      />
      <View style={styles.textContainer}>
        <Text style={[styles.text, { color: colors.tabIconDefault }]}>
          Juntos, somos a voz de quem não pode falar.
        </Text>
      </View>
      <Image
        source={require('@/assets/images/pets/cat-bottom-login-screen-3.webp')}
        style={[styles.catImage, {
          opacity: isDark ? 0.3 : 0.4,
          tintColor: isDark ? '#6B7A94' : '#7FB3CC',
        }]}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 30,
    marginBottom: 20,
  },
  shieldImage: {
    width: 60,
    height: 60,
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  catImage: {
    width: 60,
    height: 60,
  },
});
