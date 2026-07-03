import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, ScrollView, Text, View } from "react-native";

import { styles } from "@/styles/complaints/evidence-validation.styles";

export const EvidenceCard = ({
  evidence,
  selected = false,
  selectable = false,
  iconName = "document-text-outline",
  photoKeySuffix = "photo",
  resolveUri,
  onPress,
  onPhotoPress,
}) => {
  const cardContent = (
    <>
      <View style={styles.evidenceCardHeader}>
        <Ionicons
          name={selectable ? (selected ? "checkbox" : "square-outline") : iconName}
          size={selectable ? 20 : 18}
          color={selected ? "#F59E0B" : selectable ? "#A8A29E" : "#F59E0B"}
        />
        <Text style={styles.evidenceAuthor}>@{evidence.username || "anônimo"}</Text>
      </View>
      <Text style={styles.evidenceDescription}>{evidence.description}</Text>
      {evidence.photos?.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.evidencePhotos}
        >
          {evidence.photos.map((photo, index) => (
            <Pressable
              key={`${evidence.id}-${photoKeySuffix}-${index}`}
              onPress={() => onPhotoPress(resolveUri(photo))}
            >
              <Image
                source={{ uri: resolveUri(photo) }}
                style={styles.evidencePhoto}
                contentFit="cover"
              />
            </Pressable>
          ))}
        </ScrollView>
      )}
    </>
  );

  if (!selectable) {
    return <View style={styles.evidenceCard}>{cardContent}</View>;
  }

  return (
    <Pressable
      style={[styles.evidenceCard, selected && styles.evidenceCardSelected]}
      onPress={onPress}
    >
      {cardContent}
    </Pressable>
  );
};
