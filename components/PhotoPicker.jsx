import { Image, StyleSheet, View, useColorScheme } from 'react-native';
import Colors from '../constants/Colors';
import Button from './ui/Button';

export default function PhotoPicker({
  imageUri,
  onPickGallery,
  onTakePhoto,
  onRemove,
}) {
  const theme = useColorScheme() || 'light';
  const colors = Colors[theme];

  const styles = StyleSheet.create({
    container: {
      gap: 12,
    },
    preview: {
      width: '100%',
      height: 220,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.tabIconDefault,
    },
  });

  return (
    <View style={styles.container}>
      {imageUri ? (
        <>
          <Image source={{ uri: imageUri }} style={styles.preview} />

          <Button
            title="Remover foto"
            onPress={onRemove}
            variant="danger"
          />
        </>
      ) : (
        <>
          <Button
            title="Selecionar da galeria"
            onPress={onPickGallery}
          />

          <Button
            title="Tirar foto"
            onPress={onTakePhoto}
          />
        </>
      )}
    </View>
  );
}