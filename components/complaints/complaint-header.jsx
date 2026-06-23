import { Image, Text, View } from 'react-native';
import { complaintsStyles } from '@/styles/complaints';
import { useColorScheme } from '@/hooks/useColorScheme';

const APP_ICON = require('@/assets/images/app-icons/icon-light.webp');

export function ComplaintsHeader({ count }) {
  const colorScheme = useColorScheme() ?? 'light';
  const styles = complaintsStyles(colorScheme);

  return (
    <View style={styles.headerWrapper}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>
            <Text style={styles.headerTitlePrimary}>PET</Text>
            <Text style={styles.headerTitleAccent}>SOS</Text>
          </Text>
          <Text style={styles.headerSubtitle}>
            {count}{' '}
            {count === 1 ? 'denúncia encontrada' : 'denúncias encontradas'}
          </Text>
        </View>

        <View style={styles.headerLogoWrap}>
          <Image source={APP_ICON} style={styles.headerLogo} resizeMode="cover" />
        </View>
      </View>
    </View>
  );
}
