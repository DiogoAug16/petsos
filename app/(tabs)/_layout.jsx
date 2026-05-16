import { Tabs } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AnimatedTabIcon } from '@/components/bottom-card/animated-tab-icon';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useUnreadCount } from '@/hooks/useUnreadCount';
import Colors from '@/styles/theme/Colors';

function ProfileTabIcon({ color, focused }) {
  const { unreadCount } = useUnreadCount();

  return (
    <View>
      <AnimatedTabIcon
        name="person-outline"
        nameActive="person"
        color={color}
        focused={focused}
      />
      {!focused && unreadCount > 0 && (
        <View style={tabBadgeStyles.badge}>
          <Text style={tabBadgeStyles.text}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </View>
      )}
    </View>
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

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerShown: false,
        lazy: true,
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
