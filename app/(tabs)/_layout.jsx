import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { AnimatedTabIcon } from '@/components/bottom-card/animated-tab-icon';
import { useRequireAuth } from '@/context/AuthPromptContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useHaptics } from '@/hooks/useHaptics';
import { usePressAnimation } from '@/hooks/usePressAnimation';
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
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation({
    toScale: 0.88,
  });

  const handlePress = () => {
    triggerHaptics('normal');
    requireAuth(
      () => {
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
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View style={[tabActionStyles.createBlobStage, animatedStyle]}>
        <View style={tabActionStyles.createIcon}>
          <Ionicons name="paw" size={31} color="#FFFFFF" />
        </View>
      </Animated.View>
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
  createBlobStage: {
    width: 68,
    height: 68,
    marginTop: -26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createIcon: {
    width: 58,
    height: 58,
    borderRadius: 22,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    backgroundColor: '#FF8C42',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const { triggerHaptics } = useHaptics();

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
          listeners={{
            tabPress: () => {
              triggerHaptics('soft');
            },
          }}
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
          listeners={{
            tabPress: () => {
              triggerHaptics('soft');
            },
          }}
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
          listeners={{
            tabPress: () => {
              triggerHaptics('soft');
            },
          }}
          options={{
            title: 'Notificações',
            tabBarIcon: ({ color, focused }) => (
              <NotificationsTabIcon color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          listeners={{
            tabPress: () => {
              triggerHaptics('soft');
            },
          }}
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
