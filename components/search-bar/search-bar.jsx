import { Ionicons } from '@expo/vector-icons';
import { useHapticPress } from '@/hooks/useHapticPress';
import { useSortOrderButtonAnimation } from '@/hooks/useSortOrderButtonAnimation';
import { sortButtonStyles } from '@/styles/search-bar-sort-button.styles';
import { Animated, TextInput, TouchableOpacity, View } from 'react-native';

export function SearchBar({
  style,
  value = '',
  onChangeText = () => {},
  showFilterBtn = false,
  onFilterPress = () => {},
  filterActive = false,
  showSortBtn = false,
  sortOrder = 'desc',
  onSortPress,
}) {
  const handleClearPress = useHapticPress(() => onChangeText(''));
  const handleFilterPress = useHapticPress(onFilterPress);
  const {
    effectiveSortOrder,
    sortIcon,
    sortLabel,
    sortWidth,
    sortLabelWidth,
    sortLabelOpacity,
    handleSortPress,
  } = useSortOrderButtonAnimation(sortOrder, onSortPress);
  const handleHapticSortPress = useHapticPress(handleSortPress);

  return (
    <View style={style.searchContainer}>
      <View style={style.searchBar}>
        <Ionicons name="search-outline" size={18} color="#8D7D78" />
        <TextInput
          style={style.searchInput}
          placeholder="Buscar denúncias…"
          placeholderTextColor="#8D7D78"
          value={value}
          onChangeText={onChangeText}
        />
        {value.length > 0 && (
          <TouchableOpacity
            onPress={handleClearPress}
            accessibilityRole="button"
            accessibilityLabel="Limpar busca"
            hitSlop={10}
          >
            <Ionicons name="close-circle" size={18} color="#8D7D78" />
          </TouchableOpacity>
        )}
        {showFilterBtn && (
          <TouchableOpacity
            style={[style.filterBtn, filterActive ? style.filterBtnActive : null]}
            onPress={handleFilterPress}
            accessibilityRole="button"
            accessibilityLabel="Abrir filtros"
          >
            <Ionicons name="options-outline" size={18} color="#fff" />
          </TouchableOpacity>
        )}
        {showSortBtn && (
          <Animated.View style={[sortButtonStyles.sortBtnWrapper, { width: sortWidth }]}>
            <TouchableOpacity
              style={[style.filterBtn, sortButtonStyles.sortBtn]}
              onPress={handleHapticSortPress}
              accessibilityRole="button"
              accessibilityLabel={`Ordenar por data ${effectiveSortOrder === 'asc' ? 'crescente' : 'decrescente'}`}
            >
              <Animated.View
                style={[
                  sortButtonStyles.sortLabelContainer,
                  { width: sortLabelWidth, opacity: sortLabelOpacity },
                ]}
              >
                <Animated.Text
                  numberOfLines={1}
                  style={[sortButtonStyles.sortLabel, style.sortBtnLabel]}
                >
                  {sortLabel}
                </Animated.Text>
              </Animated.View>
              <View style={sortButtonStyles.sortIconContainer}>
                <Ionicons name={sortIcon} size={18} color="#fff" />
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </View>
  );
}
