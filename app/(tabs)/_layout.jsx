import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AnimatedTabIcon } from '@/components/bottom-card/animated-tab-icon';
import { useRequireAuth } from '@/context/AuthPromptContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useHaptics } from '@/hooks/useHaptics';
import { useUnreadCount } from '@/hooks/useUnreadCount';
import Colors from '@/styles/theme/Colors';

function ProfileTabIcon({ color, focused }) {
  return (
    <AnimatedTabIcon
      name="person-outline"
      nameActive="person"
      color={color}
      focused={focused}
    />
  );
}

function NotificationsTabIcon({ color, focused }) {
  const { unreadCount } = useUnreadCount();

  return (
    <View>
      <AnimatedTabIcon
        name="notifications-outline"
        nameActive="notifications"
        color={color}
        focused={focused}
      />
      {unreadCount > 0 && (
        <View style={tabBadgeStyles.badge}>
          <Text style={tabBadgeStyles.text}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </View>
      )}
    </View>
  );
}

function CreateComplaintTabButton() {
  const router = useRouter();
  const requireAuth = useRequireAuth();
  const { triggerHaptics } = useHaptics();

  const handlePress = () => {
    requireAuth(
      () => {
        triggerHaptics('normal');
        router.push('/complaint/create');
      },
      {
        title: 'Entre para criar uma denúncia',
        message: 'Faça login ou crie uma conta para registrar uma denúncia.',
      }
    );
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Criar denúncia"
      style={tabActionStyles.createTab}
      onPress={handlePress}
    >
      <View style={tabActionStyles.createIcon}>
        <Ionicons name="add" size={34} color="#FFFFFF" />
      </View>
    </Pressable>
  );
}

function NotificationsTabButton({ children, style }) {
  const router = useRouter();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Abrir notificações"
      style={style}
      onPress={() => router.push('/notifications')}
    >
      {children}
    </Pressable>
  );
}

const tabBadgeStyles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: '#EF4444',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});

const tabActionStyles = StyleSheet.create({
  createTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 2,
  },
  createIcon: {
    width: 52,
    height: 52,
    marginTop: -22,
    borderRadius: 18,
    backgroundColor: '#FF9F1C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
});

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerShown: false,
        lazy: true,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="complaints"
        options={{
          title: 'Denúncias',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              name="warning-outline"
              nameActive="warning"
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              name="map-outline"
              nameActive="map"
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        listeners={{
          tabPress: (event) => {
            event.preventDefault();
          },
        }}
        options={{
          title: 'Criar',
          tabBarButton: () => <CreateComplaintTabButton />,
        }}
      />
      <Tabs.Screen
        name="notifications-tab"
        options={{
          title: 'Notificações',
          tabBarIcon: ({ color, focused }) => (
            <NotificationsTabIcon color={color} focused={focused} />
          ),
          tabBarButton: (props) => <NotificationsTabButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <ProfileTabIcon color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
