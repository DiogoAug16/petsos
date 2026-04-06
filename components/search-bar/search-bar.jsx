import { Ionicons } from '@expo/vector-icons';
import { TextInput, TouchableOpacity, View } from 'react-native';

export function SearchBar({ style, value = '', onChangeText, showFilterBtn = false }) {
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
      </View>
    </View>
  );
}