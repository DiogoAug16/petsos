import { Text, View, Image } from 'react-native';
import { complaintsStyles } from '@/styles/complaints';
import { useColorScheme } from '@/hooks/useColorScheme';

const ICONS = {
  light: require('@/assets/images/app-icons/icon-light.webp'),
  dark: require('@/assets/images/app-icons/icon-dark.webp'),
};

export function ComplaintsHeader({ count }) {
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';
  const styles = complaintsStyles(colorScheme);

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerTitle}>
          <Text style={{ color: isDark ? '#fff' : '#1C1C1E' }}>PET</Text>
          <Text style={{ color: '#FF3B30' }}>SOS</Text>
        </Text>
        <Text style={styles.headerSubtitle}>
          {count}{' '}
          {count === 1 ? 'denúncia encontrada' : 'denúncias encontradas'}
        </Text>
      </View>

      <Image
        source={ICONS[colorScheme]}
        style={{ width: 55, height: 55, borderRadius: 10 }}
      />
    </View>
  );
}