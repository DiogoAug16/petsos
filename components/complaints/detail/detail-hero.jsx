import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Modal, Pressable, Text, useWindowDimensions, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useUploadUrl } from '@/hooks/shared/useUploadUrl';
import { buildUploadPhotoUri } from '@/utils/media/photo.utils';

export function DetailHero({
  complaint,
  type,
  emoji,
  styles,
  theme,
  isOwner,
  canDelete,
  onBack,
  onEdit,
  onDelete,
  onReport,
}) {
  const menuButtonRef = useRef(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 88, right: 12 });
  const [coverFailed, setCoverFailed] = useState(false);
  const { width: windowWidth } = useWindowDimensions();
  const UPLOAD_URL = useUploadUrl();
  const coverPhotoUri = buildUploadPhotoUri(complaint.photos?.[0], UPLOAD_URL);
  const shouldShowCover = coverPhotoUri && !coverFailed;
  const canShowDelete = isOwner || canDelete;
  const canShowReport = Boolean(onReport) && !canShowDelete;
  const canShowMenu = isOwner || canShowDelete || canShowReport;

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
        <>
          <Image
            source={{ uri: coverPhotoUri }}
            style={styles.detailHeroImage}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={120}
            onError={() => setCoverFailed(true)}
          />
          <LinearGradient
            colors={['rgba(255,246,236,0)', 'rgba(255,246,236,0.64)', '#FFF6EC']}
            locations={[0, 0.62, 1]}
            style={styles.detailHeroFade}
            pointerEvents="none"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          />
        </>
      ) : (
        <View style={[styles.detailHeroContent, { backgroundColor: type.photoColor }]}>
          <View style={styles.detailHeroBlobPrimary} />
          <View style={styles.detailHeroBlobSecondary} />
          <View style={styles.detailHeroPawPrint}>
            <Ionicons name="paw" size={28} color="#FF8C42" />
          </View>
          <Text style={styles.detailHeroEmoji}>{emoji}</Text>
        </View>
      )}

      <View style={styles.detailHeroHeader}>
        <Pressable
          style={styles.detailIconButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Ionicons name="arrow-back" size={20} color={theme.text} />
        </Pressable>
        
        {canShowMenu ? (
          <Pressable
            ref={menuButtonRef}
            collapsable={false}
            style={styles.detailIconButton}
            onPress={openMenu}
            accessibilityRole="button"
            accessibilityLabel="Abrir opções da denúncia"
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
            {isOwner ? (
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
            ) : null}

            {canShowDelete ? (
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
            ) : null}

            {canShowReport ? (
              <Pressable
                style={styles.detailHeroMenuItem}
                onPress={() => {
                  setMenuVisible(false);
                  onReport?.();
                }}
              >
                <Ionicons name="flag-outline" size={18} color="#E24B4A" />
                <Text style={styles.detailHeroMenuDangerText}>Reportar</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </Modal>
    </View>
  );
}
