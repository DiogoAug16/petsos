import { PublicProfileScreen } from '@/components/profile/public-profile-screen';
import { Stack, useLocalSearchParams } from 'expo-router';

export default function UserProfileScreen() {
  const { username, followedOnly } = useLocalSearchParams();
  const normalizedUsername = Array.isArray(username) ? username[0] : username;
  const shouldShowOnlyFollowed = (Array.isArray(followedOnly) ? followedOnly[0] : followedOnly) === '1';

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <PublicProfileScreen
        username={normalizedUsername}
        showBack
        followedOnly={shouldShowOnlyFollowed}
      />
    </>
  );
}
