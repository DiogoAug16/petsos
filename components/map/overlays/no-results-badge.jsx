import { View, Text } from 'react-native';

export function NoResultsBadge({ styles, message }) {
  return (
    <View style={styles.noResultsBadge}>
      <Text style={styles.noResultsText}>{message}</Text>
    </View>
  );
}
