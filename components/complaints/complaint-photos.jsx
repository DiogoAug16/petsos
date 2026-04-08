import { Image, ScrollView, StyleSheet } from 'react-native';
import { useUploadUrl } from '@/hooks/useUploadUrl';

export default function ComplaintPhotos({ photos }) {
  const UPLOAD_URL = useUploadUrl();
  
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {photos.map((uri, index) => (
        <Image 
          key={index} 
          source={{ uri: `${UPLOAD_URL}${uri}` }} 
          style={styles.photo} 
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  photo: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginRight: 10,
  },
});