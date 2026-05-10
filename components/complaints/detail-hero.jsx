import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Modal, Pressable, Text, useWindowDimensions, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useUploadUrl } from '@/hooks/useUploadUrl';

const getPhotoPath = (photo) => {
  if (typeof photo === 'string') return photo;
  if (!photo || typeof photo !== 'object') return null;
  return photo.url || photo.uri || photo.path || photo.filePath || null;
};

export function DetailHero({
  complaint,
  type,
  emoji,
  styles,
  theme,
  isOwner,
  onBack,
  onEdit,
  onDelete,
}) {
  const menuButtonRef = useRef(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 88, right: 12 });
  const [coverFailed, setCoverFailed] = useState(false);
  const { width: windowWidth } = useWindowDimensions();
  const UPLOAD_URL = useUploadUrl();
  const resolvePhotoUri = (photo) => {
    const photoPath = getPhotoPath(photo);
    if (!photoPath) return null;
    if (/^(https?:|file:|content:|data:)/i.test(photoPath)) return photoPath;
    if (!UPLOAD_URL) return photoPath;

    const baseUrl = UPLOAD_URL.endsWith('/') ? UPLOAD_URL.slice(0, -1) : UPLOAD_URL;
    const normalizedPath = photoPath.startsWith('/') ? photoPath : `/${photoPath}`;
    return `${baseUrl}${normalizedPath}`;
  };
  const coverPhotoUri = resolvePhotoUri(complaint.photos?.[0]);
  const shouldShowCover = coverPhotoUri && !coverFailed;

  useEffect(() => {
    setCoverFailed(false);
  }, [coverPhotoUri]);

  const openMenu = () => {
    if (!menuButtonRef.current?.measureInWindow) {
      setMenuVisible(true);
      return;
    }

    menuButtonRef.current.measureInWindow((x, y, width, height) => {
      setMenuPosition({
        top: y,
        right: Math.max(12, windowWidth - x - width),
      });

      setMenuVisible(true);
    });
  };

  return (
    <View style={styles.detailHero}>
      {shouldShowCover ? (
        <Image
          source={{ uri: coverPhotoUri }}
          style={styles.detailHeroImage}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={120}
          onError={() => setCoverFailed(true)}
        />
      ) : (
        <View style={[styles.detailHeroContent, { backgroundColor: type.photoColor }]}>
          <Text style={styles.detailHeroEmoji}>{emoji}</Text>
        </View>
      )}

      <View style={styles.detailHeroHeader}>
        <Pressable style={styles.detailIconButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color={theme.text} />
        </Pressable>
        
        {isOwner ? (
          <Pressable
            ref={menuButtonRef}
            collapsable={false}
            style={styles.detailIconButton}
            onPress={openMenu}
          >
            <Ionicons name="ellipsis-vertical" size={20} color={theme.text} />
          </Pressable>
        ) : (
          <View style={styles.detailIconButtonPlaceholder} />
        )}
      </View>

      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.detailMenuBackdrop}>
          <Pressable
            style={styles.detailMenuDismissArea}
            onPress={() => setMenuVisible(false)}
          />

          <View style={[styles.detailHeroMenu, menuPosition]}>
            <Pressable
              style={styles.detailHeroMenuItem}
              onPress={() => {
                setMenuVisible(false);
                onEdit();
              }}
            >
              <Ionicons name="create-outline" size={18} color={theme.text} />
              <Text style={styles.detailHeroMenuText}>Editar</Text>
            </Pressable>

            <Pressable
              style={styles.detailHeroMenuItem}
              onPress={() => {
                setMenuVisible(false);
                onDelete();
              }}
            >
              <Ionicons name="trash-outline" size={18} color="#E24B4A" />
              <Text style={styles.detailHeroMenuDangerText}>Excluir</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
