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
  if (!normalizedUsername) return '#8A8A8E';

  const value = normalizedUsername
    .split('')
    .reduce((total, char) => total + char.charCodeAt(0), 0);

  return AVATAR_COLORS[value % AVATAR_COLORS.length];
};

export function UserAvatar({
  username,
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
      <Text style={[styles.avatarText, { fontSize: textSize }, textStyle]}>
        {getInitial(username)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '800',
  },
});
