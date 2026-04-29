/**
 * Wraps `expo-haptics` with a simple, opinionated set of feedback styles.
 *
 * Each method swallows errors so that environments without haptics
 * support (web, simulators) silently degrade. The hook respects a
 * "haptics enabled" preference from `useSettings` so users can disable
 * vibrations system-wide.
 */

import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import { useSettings } from './useSettings';

export type HapticsStyle =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'soft'
  | 'rigid'
  | 'success'
  | 'warning'
  | 'error'
  | 'selection';

export function useHaptics() {
  const { settings } = useSettings();

  return useCallback(
    async (style: HapticsStyle = 'light') => {
      if (!settings.hapticsEnabled) return;
      try {
        switch (style) {
          case 'light':
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            break;
          case 'medium':
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            break;
          case 'heavy':
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            break;
          case 'soft':
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
            break;
          case 'rigid':
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
            break;
          case 'success':
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            break;
          case 'warning':
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            break;
          case 'error':
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            break;
          case 'selection':
            await Haptics.selectionAsync();
            break;
        }
      } catch {
        // Haptics not supported on this platform; silently degrade.
      }
    },
    [settings.hapticsEnabled],
  );
}

export function useHapticPress() {
  const haptic = useHaptics();
  return useCallback(() => haptic('light'), [haptic]);
}

export function useSuccessHaptic() {
  const haptic = useHaptics();
  return useCallback(() => haptic('success'), [haptic]);
}

export function useErrorHaptic() {
  const haptic = useHaptics();
  return useCallback(() => haptic('error'), [haptic]);
}
