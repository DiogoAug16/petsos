import { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import ComplaintPhotos from './complaint-photos';
import { getPhotoPath } from '@/utils/photo.utils';

export function DetailPhotosCard({ photos, styles }) {
  const validPhotos = useMemo(
    () =>
      Array.isArray(photos)
        ? photos
            .map(getPhotoPath)
            .filter((photo) => typeof photo === 'string' && photo.trim().length > 0)
        : [],
    [photos],
  );
  const [failedPhotos, setFailedPhotos] = useState(new Set());

  useEffect(() => {
    setFailedPhotos(new Set());
  }, [validPhotos]);

  const visiblePhotos = validPhotos.filter((photo) => !failedPhotos.has(photo));

  if (visiblePhotos.length === 0) return null;

  return (
    <View style={styles.detailCard}>
      <Text style={styles.detailSectionLabel}>Imagens</Text>
      <ComplaintPhotos
        photos={visiblePhotos}
        onPhotoError={(photo) => {
          setFailedPhotos((current) => new Set(current).add(photo));
        }}
      />
    </View>
  );
}
