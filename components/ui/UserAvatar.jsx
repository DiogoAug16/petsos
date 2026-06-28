import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

const AVATAR_COLORS = [
  '#2ECC9A',
  '#4A90E2',
  '#9B59B6',
  '#F39C12',
  '#E67E80',
  '#16A085',
  '#D35400',
  '#607D8B',
];

const normalizeUsername = (username) => {
  if (typeof username !== 'string') return '';
  return username.trim();
};

const getInitial = (username) => {
  const normalizedUsername = normalizeUsername(username);
  if (!normalizedUsername) return '?';
  return normalizedUsername.slice(0, 1).toUpperCase();
};

const getAvatarColor = (username) => {
  const normalizedUsername = normalizeUsername(username);
  if (!normalizedUsername) return '#8D7D78';

  const value = normalizedUsername
    .split('')
    .reduce((total, char) => total + char.charCodeAt(0), 0);

  return AVATAR_COLORS[value % AVATAR_COLORS.length];
};

export function UserAvatar({
  username,
  imageUri,
  size = 34,
  textSize = 13,
  style,
  textStyle,
}) {
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: getAvatarColor(username),
        },
        style,
      ]}
    >
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={styles.avatarImage}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={120}
          accessibilityIgnoresInvertColors
        />
      ) : (
        <Text style={[styles.avatarText, { fontSize: textSize }, textStyle]}>
          {getInitial(username)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '800',
  },
});
