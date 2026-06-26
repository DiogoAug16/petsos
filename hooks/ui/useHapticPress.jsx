import { useCallback } from 'react';

import { useHaptics } from '@/hooks/ui/useHaptics';

export function useHapticPress(onPress, weight = 'soft') {
  const { triggerHaptics } = useHaptics();

  return useCallback(
    (...args) => {
      triggerHaptics(weight);
      onPress?.(...args);
    },
    [onPress, triggerHaptics, weight]
  );
}
