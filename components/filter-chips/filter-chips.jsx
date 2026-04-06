import { FILTER_CHIPS } from '@/constants/complaints.costants';
import { filterChipsStyles } from '@/styles/filter-chips.style';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ScrollView, Text, TouchableOpacity } from 'react-native';

export function FilterChips({ activeChip = null, onChipPress }) {
  const colorScheme = useColorScheme();
  const styles = filterChipsStyles(colorScheme);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollWrapper}
      contentContainerStyle={styles.chipsContainer}
    >
      {FILTER_CHIPS.map((chip) => (
        <TouchableOpacity
          key={chip.label}
          style={[styles.chip, activeChip === chip.value ? styles.chipActive : null]}
          onPress={() => onChipPress(chip.value)}
        >
          <Text style={[styles.chipText, activeChip === chip.value ? styles.chipTextActive : null]}>
            {chip.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}