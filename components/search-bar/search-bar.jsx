import { Ionicons } from '@expo/vector-icons';
import { TextInput, TouchableOpacity, View } from 'react-native';

export function SearchBar({ style }) {
  return (
    <View style={style.searchContainer}>
      <View style={style.searchBar}>
        <Ionicons name="search-outline" size={18} color="#8A8A8E" />
        <TextInput
          style={style.searchInput}
          placeholder="Buscar área..."
          placeholderTextColor="#8A8A8E"
        />
        <TouchableOpacity style={style.filterBtn}>
          <Ionicons name="options-outline" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}