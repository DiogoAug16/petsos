import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export const MIN_VALIDATIONS = 3;

export function ValidationCounter({ current = 0 }) {
  const progress = Math.min(current / MIN_VALIDATIONS, 1);
  const reachedMinimum = current >= MIN_VALIDATIONS;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="checkmark-circle"
          size={20}
          color={reachedMinimum ? '#10B981' : '#64748B'}
        />

        <Text style={styles.text}>
          {current}/{MIN_VALIDATIONS} validações
        </Text>
      </View>

      <View style={styles.progressBackground}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${progress * 100}%`,
              backgroundColor: reachedMinimum ? '#10B981' : '#F59E0B',
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  progressBackground: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
});