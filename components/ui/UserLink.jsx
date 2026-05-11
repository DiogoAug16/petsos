import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

const normalizeUsername = (username) => {
  if (typeof username !== 'string') return '';
  return username.trim().replace(/^@/, '');
};

export function UserLink({ username, children, style, disabled = false }) {
  const router = useRouter();
  const normalizedUsername = normalizeUsername(username);
  const canNavigate = Boolean(normalizedUsername) && !disabled;

  if (!canNavigate) {
    return <View style={style}>{children}</View>;
  }

  return (
    <Pressable
      style={style}
      hitSlop={8}
      onPress={() => router.push(`/users/${encodeURIComponent(normalizedUsername)}`)}
    >
      {children}
    </Pressable>
  );
}
