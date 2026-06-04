import { useUploadUrl } from '@/hooks/useUploadUrl';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const formatRelativeTime = (date) => {
  if (!date) return '';
  const now = Date.now();
  const timestamp = typeof date === 'string' ? new Date(date).getTime() : date;
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'agora';
  if (minutes < 60) return `há ${minutes} min`;
  if (hours < 24) return `há ${hours}h`;
  if (days < 30) return `há ${days}d`;
  return new Date(timestamp).toLocaleDateString('pt-BR');
};

export function EvidenceSection({ evidences, styles: parentStyles }) {
  const uploadUrl = useUploadUrl();
  const [fullscreenPhoto, setFullscreenPhoto] = useState(null);

  if (!evidences || evidences.length === 0) return null;

  const visibleEvidences = evidences.filter((e) => e.status !== 'rejected');
  if (visibleEvidences.length === 0) return null;

  const sortedEvidences = [...visibleEvidences].sort((a, b) => {
    if (a.status === 'approved' && b.status !== 'approved') return -1;
    if (a.status !== 'approved' && b.status === 'approved') return 1;
    return 0;
  });

  const resolveUri = (uri) => {
    if (!uri) return '';
    if (/^(https?:|file:)/i.test(uri)) return uri;
    if (!uploadUrl) return uri;
    const base = uploadUrl.endsWith('/') ? uploadUrl.slice(0, -1) : uploadUrl;
    const path = uri.startsWith('/') ? uri : `/${uri}`;
    return `${base}${path}`;
  };

  return (
    <>
      <View style={parentStyles?.detailCard}>
        <Text style={parentStyles?.detailSectionLabel}>Evidências</Text>

        {sortedEvidences.map((evidence) => {
          const isApproved = evidence.status === 'approved';
          return (
            <View key={evidence.id} style={[localStyles.card, isApproved && localStyles.cardApproved]}>
              <View style={localStyles.cardHeader}>
                <View style={localStyles.cardHeaderLeft}>
                  {isApproved && (
                    <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  )}
                  <Text style={localStyles.username}>
                    @{evidence.username || 'anônimo'}
                  </Text>
                </View>
                <Text style={localStyles.date}>
                  {formatRelativeTime(evidence.createdAt)}
                </Text>
              </View>

              {isApproved && (
                <Text style={localStyles.approvedBadge}>Evidência aprovada</Text>
              )}

              <Text style={localStyles.description}>{evidence.description}</Text>

              {evidence.photos?.length > 0 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={localStyles.photosScroll}
                >
                  {evidence.photos.map((photo, i) => (
                    <Pressable
                      key={`${evidence.id}-photo-${i}`}
                      onPress={() => setFullscreenPhoto(resolveUri(photo))}
                    >
                      <Image
                        source={{ uri: resolveUri(photo) }}
                        style={localStyles.photo}
                        contentFit="cover"
                        transition={120}
                      />
                    </Pressable>
                  ))}
                </ScrollView>
              )}
            </View>
          );
        })}
      </View>

      <Modal
        visible={!!fullscreenPhoto}
        transparent
        animationType="fade"
        onRequestClose={() => setFullscreenPhoto(null)}
      >
        <View style={localStyles.fullscreenBackdrop}>
          <Pressable
            style={localStyles.fullscreenClose}
            onPress={() => setFullscreenPhoto(null)}
          >
            <Ionicons name="close" size={28} color="#fff" />
          </Pressable>
          {fullscreenPhoto && (
            <Image
              source={{ uri: fullscreenPhoto }}
              style={localStyles.fullscreenImage}
              contentFit="contain"
            />
          )}
        </View>
      </Modal>
    </>
  );
}

const localStyles = StyleSheet.create({
  card: {
    backgroundColor: '#E8F4F8',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  cardApproved: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  username: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  approvedBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 6,
  },
  date: {
    fontSize: 11,
    color: '#8A8A8E',
  },
  description: {
    fontSize: 14,
    color: '#1C1C1E',
    lineHeight: 20,
    marginBottom: 10,
  },
  photosScroll: {
    marginTop: 4,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 8,
  },
  fullscreenBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenClose: {
    position: 'absolute',
    top: 56,
    right: 16,
    zIndex: 10,
  },
  fullscreenImage: {
    width: '100%',
    height: '80%',
  },
});
