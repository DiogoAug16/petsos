// hooks/useHaptics.jsx
import * as Haptics from "expo-haptics";
import { useCallback } from "react";

export function useHaptics() {
  const triggerHaptics = useCallback(async (weight) => {
    switch (weight) {
      case "soft":
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        break;
      case "normal":
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case "heavy":
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      default:
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  return { triggerHaptics };
}