import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { useProfileLocationSuggestions } from '@/hooks/profile/useProfileLocationSuggestions';
import { useHapticPress } from '@/hooks/ui/useHapticPress';

export function ProfileLocationAutocomplete({
  value,
  onChangeText,
  disabled,
  styles,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const { suggestions, loading } = useProfileLocationSuggestions(value);
  const selectLocation = useHapticPress((location) => {
    onChangeText(location);
    setIsFocused(false);
  }, 'soft');
  const shouldShowSuggestions =
    isFocused && value.trim().length > 0 && (loading || suggestions.length > 0);

  return (
    <View style={styles.autocompleteWrap}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Cuiabá, MT"
        placeholderTextColor="#A99A91"
        autoCapitalize="words"
        autoCorrect={false}
        returnKeyType="next"
        maxLength={80}
        editable={!disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        accessibilityLabel="Localização no formato cidade, estado"
      />

      {shouldShowSuggestions && (
        <View style={styles.suggestionsList}>
          {loading ? (
            <View style={styles.suggestionItem}>
              <Ionicons name="location-outline" size={16} color="#8D7D78" />
              <Text style={styles.suggestionText}>Buscando cidades…</Text>
            </View>
          ) : (
            suggestions.map((location) => (
              <Pressable
                key={location}
                style={styles.suggestionItem}
                onPressIn={() => selectLocation(location)}
                disabled={disabled}
                accessibilityRole="button"
                accessibilityLabel={`Usar localização ${location}`}
              >
                <Ionicons name="location-outline" size={16} color="#8D7D78" />
                <Text style={styles.suggestionText}>{location}</Text>
              </Pressable>
            ))
          )}
        </View>
      )}
    </View>
  );
}
