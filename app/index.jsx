import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useHapticPress } from '@/hooks/ui/useHapticPress';
import { onboardingStyles as styles } from '@/styles/onboarding/onboarding.styles';

const WELCOME_IMAGE = require('@/assets/images/pets/bem_vindo.webp');
const START_BACKGROUND = require('@/assets/images/pets/startpage.webp');

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const isCompact = height < 740;
  const heroHeight = Math.min(isCompact ? 300 : 360, Math.max(260, height * 0.43));
  const sheetMinHeight = isCompact ? 304 : 338;
  const handleGetStarted = useHapticPress(() => {
    router.replace('/(tabs)');
  }, 'normal');

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: insets.top + 18,
          paddingBottom: 0,
        },
      ]}
    >
      <Image
        source={START_BACKGROUND}
        style={styles.backgroundImage}
        contentFit="cover"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />

      <View style={styles.heroWrap}>
        <Image
          source={WELCOME_IMAGE}
          style={[styles.heroImage, { height: heroHeight }]}
          contentFit="contain"
          transition={160}
          accessible
          accessibilityRole="image"
          accessibilityLabel="Cachorro e gato protegidos por uma mão em uma casinha"
        />
      </View>

      <View
        style={[
          styles.contentSheet,
          {
            minHeight: sheetMinHeight,
            paddingBottom: insets.bottom + 14,
          },
        ]}
      >
        <LinearGradient
          pointerEvents="none"
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.48)', '#FFFFFF']}
          style={styles.sheetTopGradient}
        />
        <Text style={[styles.title, isCompact && styles.titleCompact]}>Seja a Voz dos Animais</Text>
        <Text style={styles.cardText}>
          Juntos, podemos acabar com o sofrimento. Relate abusos e ajude-nos a criar um mundo seguro para todos os animais.
        </Text>

        <Pressable
          style={styles.primaryButton}
          onPress={handleGetStarted}
          accessibilityRole="button"
          accessibilityLabel="Começar a usar o PetSOS"
        >
          <Text style={styles.primaryButtonText}>Denunciar Agora</Text>
          <View style={styles.buttonIconBadge}>
            <Ionicons name="megaphone-outline" size={25} color="#FF9F1C" />
          </View>
        </Pressable>
      </View>
    </View>
  );
}
