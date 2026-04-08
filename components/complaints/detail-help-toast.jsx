import { Text, View } from 'react-native';

export function DetailHelpToast({ isHelping, styles }) {
  if (!isHelping) return null;

  return (
    <View style={styles.detailToast}>
      <Text style={styles.detailToastTitle}>Obrigado por se comprometer a ajudar neste caso!</Text>
      <Text style={styles.detailToastSubtitle}>A denúncia foi adicionada às suas responsabilidades.</Text>
    </View>
  );
}
