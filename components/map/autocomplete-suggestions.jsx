import { View, Text, TouchableOpacity, Keyboard } from 'react-native';

export function AutocompleteSuggestions({
  styles,
  suggestions,
  selectSuggestion,
  mapRef,
}) {
  return (
    <View style={styles.autocompleteContainer}>
      {suggestions.map((complaint, index) => {
        const complaintId = complaint?.id ?? complaint?._id;
        const itemKey = complaintId ? String(complaintId) : `suggestion-${index}`;

        return (
          <TouchableOpacity
            key={itemKey}
            style={[
              styles.autocompleteItem,
              index === suggestions.length - 1 ? styles.autocompleteItemLast : null,
            ]}
            activeOpacity={0.8}
            onPress={() => {
              const nextRegion = selectSuggestion(complaint);
              Keyboard.dismiss();
              if (nextRegion) {
                mapRef.current?.animateToRegion(nextRegion, 600);
              }
            }}
          >
            <Text style={styles.autocompleteTitle} numberOfLines={1}>
              {complaint.title}
            </Text>
            <Text style={styles.autocompleteSubtitle} numberOfLines={1}>
              {complaint.type}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
