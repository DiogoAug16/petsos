import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { Text, View } from 'react-native';

function LoginSocialPlaceholder({ styles }) {
  return (
    <View style={styles.socialSlot}>
      <View style={styles.socialDivider}>
        <View style={styles.socialDividerLine} />
        <Text style={styles.socialDividerText}>ou</Text>
        <View style={styles.socialDividerLine} />
      </View>

      <View style={styles.socialSoonCard}>
        <View style={styles.socialSoonIcon}>
          <Ionicons name="logo-google" size={18} color="#FF8C42" />
        </View>
        <View style={styles.socialSoonCopy}>
          <Text style={styles.socialSoonTitle}>Google em breve</Text>
          <Text style={styles.socialSoonText}>Acesso rápido ficará aqui.</Text>
        </View>
      </View>
    </View>
  );
}

export default memo(LoginSocialPlaceholder);
