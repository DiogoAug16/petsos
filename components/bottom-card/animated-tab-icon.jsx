import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export function AnimatedTabIcon({ name, nameActive, color, focused }) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: focused ? 1.15 : 1,
        useNativeDriver: true,
        speed: 20,
        bounciness: 8,
      }),
      Animated.timing(opacity, {
        toValue: focused ? 1 : 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused, opacity, scale]);

  return (
    <Animated.View
      style={{
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ scale }],
      }}
    >
      <Animated.View
        style={{
          position: 'absolute',
          width: 40,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
          opacity,
        }}
      >
        <Ionicons name={nameActive} size={32} color={color} />
      </Animated.View>
      <Animated.View
        style={{
          width: 40,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: Animated.subtract(1, opacity),
        }}
      >
        <Ionicons name={name} size={32} color={color} />
      </Animated.View>
    </Animated.View>
  );
}
