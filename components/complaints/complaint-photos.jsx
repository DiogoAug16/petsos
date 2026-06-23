import { Image } from 'expo-image';
import { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUploadUrl } from '@/hooks/useUploadUrl';
import { buildUploadPhotoUri } from '@/utils/photo.utils';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ComplaintPhotos({ photos, onPhotoError }) {
  const UPLOAD_URL = useUploadUrl();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const resolvedPhotos = photos
    .map((uri) => ({ original: uri, resolved: buildUploadPhotoUri(uri, UPLOAD_URL) }))
    .filter((p) => p.resolved);

  const openPhoto = (index) => {
    setSelectedIndex(index);
    setModalVisible(true);
  };

  return (
    <>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {resolvedPhotos.map(({ original, resolved }, index) => (
          <Pressable key={`${original}-${index}`} onPress={() => openPhoto(index)}>
            <Image
              source={{ uri: resolved }}
              style={styles.photo}
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={120}
              onError={() => onPhotoError?.(original)}
            />
          </Pressable>
        ))}
      </ScrollView>

      <PhotoViewerModal
        visible={modalVisible}
        photos={resolvedPhotos}
        initialIndex={selectedIndex}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}

function PhotoViewerModal({ visible, photos, initialIndex, onClose }) {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <Pressable
          style={[styles.closeButton, { top: insets.top + 10 }]}
          onPress={onClose}
        >
          <Ionicons name="close" size={28} color="#FFFFFF" />
        </Pressable>

        <FlatList
          data={photos}
          horizontal
          pagingEnabled
          initialScrollIndex={initialIndex}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `${item.original}-${index}`}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          renderItem={({ item }) => (
            <View style={styles.modalSlide}>
              <Image
                source={{ uri: item.resolved }}
                style={styles.modalImage}
                contentFit="contain"
                cachePolicy="memory-disk"
              />
            </View>
          )}
        />

        {photos.length > 1 && (
          <Text style={[styles.counter, { bottom: insets.bottom + 20 }]}>
            {currentIndex + 1} / {photos.length}
          </Text>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  photo: {
    width: 214,
    height: 156,
    borderRadius: 20,
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSlide: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.75,
  },
  counter: {
    position: 'absolute',
    alignSelf: 'center',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
