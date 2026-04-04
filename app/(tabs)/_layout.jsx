import { Tabs } from 'expo-router';

import Colors from '@/constants/Colors';
import { AnimatedTabIcon } from '@/components/bottom-card/animated-tab-icon';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerShown: false,
      }}
    >
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
    </Tabs>
  );
}