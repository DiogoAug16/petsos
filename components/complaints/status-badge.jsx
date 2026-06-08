import { Text, View } from 'react-native';
import { STATUS_CONFIG } from '@/constants/complaints.constants';

export function StatusBadge({ status, styles }) {
  let statusKey = status;
  if (statusKey === 'resolved') statusKey = 'resolvido';

  const config = STATUS_CONFIG[statusKey];
  if (!config) return null;

  return (
    <View style={styles[config.container]}>
      <Text style={styles[config.text]}>{config.label}</Text>
    </View>
  );
}
