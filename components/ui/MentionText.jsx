import { useRouter } from 'expo-router';
import { Text } from 'react-native';

const MENTION_PATTERN = /(@[A-Za-z0-9_.-]+)/g;

export function MentionText({ text, style, mentionStyle }) {
  const router = useRouter();
  const value = String(text ?? '');
  const parts = value.split(MENTION_PATTERN);

  return (
    <Text style={style}>
      {parts.map((part, index) => {
        if (!part.match(MENTION_PATTERN)) {
          return part;
        }

        const username = part.slice(1);

        return (
          <Text
            key={`${part}-${index}`}
            style={mentionStyle}
            onPress={() => router.push(`/users/${encodeURIComponent(username)}`)}
          >
            {part}
          </Text>
        );
      })}
    </Text>
  );
}
