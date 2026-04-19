import { View, Text } from 'react-native';

export default function AuthHero({ colors, styles, title, subtitle }) {
  return (
    <View style={styles.heroSection}>
      <View style={styles.headerTextContainer}>
        <Text style={styles.brandName}>
          pet<Text style={[styles.brandSOS, { color: colors.primary }]}>SOS</Text>
        </Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}
