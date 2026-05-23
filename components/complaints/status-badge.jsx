import { Text, View } from 'react-native';
import { STATUS_CONFIG } from '@/constants/complaints.constants';

export function StatusBadge({ status, styles }) {
  const config = STATUS_CONFIG[status];
  if (!config) return null;

  return (
    <View style={styles[config.container]}>
      <Text style={styles[config.text]}>{config.label}</Text>
    </View>
  );
}
