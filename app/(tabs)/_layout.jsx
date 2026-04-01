// app/(tabs)/_layout.jsx
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import Colors from '@/constants/Colors';
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
          tabBarIcon: ({ color }) => (
            <Ionicons name="map-outline" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="complaints"
        options={{
          title: 'Denúncias',
          tabBarIcon: ({ color }) => (
            <Ionicons name="warning-outline" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}