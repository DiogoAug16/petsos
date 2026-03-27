import { Ionicons } from '@expo/vector-icons';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { mapScreenStyles } from '@/components/styles/mapScreen.styles.jsx';
import { useColorScheme } from '@/components/useColorScheme.jsx';

export function SearchBar() {
  const colorScheme = useColorScheme() ?? 'light';
  const styles = mapScreenStyles(colorScheme);

  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color="#8A8A8E" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar área..."
          placeholderTextColor="#8A8A8E"
        />
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="options-outline" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}