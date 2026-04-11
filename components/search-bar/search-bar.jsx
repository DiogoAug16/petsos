import { Ionicons } from '@expo/vector-icons';
import { useSortOrderButtonAnimation } from '@/hooks/useSortOrderButtonAnimation';
import { sortButtonStyles } from '@/styles/search-bar-sort-button.styles';
import { Animated, TextInput, TouchableOpacity, View } from 'react-native';

export function SearchBar({
  style,
  value = '',
  onChangeText = () => {},
  showFilterBtn = false,
  showSortBtn = false,
  sortOrder = 'desc',
  onSortPress,
}) {
  const {
    effectiveSortOrder,
    sortIcon,
    sortLabel,
    sortWidth,
    sortLabelWidth,
    sortLabelOpacity,
    handleSortPress,
  } = useSortOrderButtonAnimation(sortOrder, onSortPress);

  return (
    <View style={style.searchContainer}>
      <View style={style.searchBar}>
        <Ionicons name="search-outline" size={18} color="#8A8A8E" />
        <TextInput
          style={style.searchInput}
          placeholder="Buscar denúncias..."
          placeholderTextColor="#8A8A8E"
          value={value}
          onChangeText={onChangeText}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText('')}>
            <Ionicons name="close-circle" size={18} color="#8A8A8E" />
          </TouchableOpacity>
        )}
        {showFilterBtn && (
          <TouchableOpacity style={style.filterBtn}>
            <Ionicons name="options-outline" size={18} color="#fff" />
          </TouchableOpacity>
        )}
        {showSortBtn && (
          <Animated.View style={[sortButtonStyles.sortBtnWrapper, { width: sortWidth }]}>
            <TouchableOpacity
              style={[style.filterBtn, sortButtonStyles.sortBtn]}
              onPress={handleSortPress}
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
