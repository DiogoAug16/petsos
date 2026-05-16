import { View, Text } from 'react-native';
import { useEffect, useState } from 'react';
import zxcvbn from 'zxcvbn';
import { styles } from '@/styles/auth/password-strength-indicator.styles';

const STRENGTH_CONFIG = {
  0: { label: 'Muito fraca', color: '#EF4444', width: '20%' },
  1: { label: 'Fraca', color: '#F97316', width: '40%' },
  2: { label: 'Média', color: '#EAB308', width: '60%' },
  3: { label: 'Forte', color: '#22C55E', width: '80%' },
  4: { label: 'Muito forte', color: '#10B981', width: '100%' },
};

export default function PasswordStrengthIndicator({ password, colors, isDark }) {
  const [strength, setStrength] = useState(null);

  useEffect(() => {
    if (!password || password.length === 0) {
      setStrength(null);
      return;
    }

    const result = zxcvbn(password);
    setStrength(result.score);
  }, [password]);

  if (strength === null) return null;

  const config = STRENGTH_CONFIG[strength];

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        <View
          style={[
            styles.bar,
            {
              backgroundColor: config.color,
              width: config.width,
            },
          ]}
        />
      </View>
      <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}
