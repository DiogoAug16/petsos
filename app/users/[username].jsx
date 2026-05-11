import { PublicProfileScreen } from '@/components/profile/public-profile-screen';
import { Stack, useLocalSearchParams } from 'expo-router';

export default function UserProfileScreen() {
  const { username } = useLocalSearchParams();
  const normalizedUsername = Array.isArray(username) ? username[0] : username;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <PublicProfileScreen username={normalizedUsername} showBack />
    </>
  );
}
