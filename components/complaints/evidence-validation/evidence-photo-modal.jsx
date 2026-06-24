import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Modal, Pressable, View } from "react-native";

import { styles } from "@/styles/complaints/evidence-validation.styles";

export const EvidencePhotoModal = ({ photoUri, onClose }) => (
  <Modal visible={!!photoUri} transparent animationType="fade" onRequestClose={onClose}>
    <View style={styles.fullscreenBackdrop}>
      <Pressable style={styles.fullscreenClose} onPress={onClose}>
        <Ionicons name="close" size={28} color="#fff" />
      </Pressable>
      {photoUri && (
        <Image
          source={{ uri: photoUri }}
          style={styles.fullscreenImage}
          contentFit="contain"
        />
      )}
    </View>
  </Modal>
);
