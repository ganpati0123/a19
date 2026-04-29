/**
 * Returns a Reanimated `useAnimatedStyle` block + onPressIn / onPressOut
 * handlers that scale and dim a target view on touch.
 */

import { useCallback } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export function useAnimatedPress(opts: { scaleTo?: number; opacityTo?: number } = {}) {
  const scaleTo = opts.scaleTo ?? 0.96;
  const opacityTo = opts.opacityTo ?? 0.85;
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const onPressIn = useCallback(() => {
    scale.value = withSpring(scaleTo, { damping: 18, stiffness: 280 });
    opacity.value = withTiming(opacityTo, { duration: 120 });
  }, [scale, opacity, scaleTo, opacityTo]);

  const onPressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 14, stiffness: 220 });
    opacity.value = withTiming(1, { duration: 160 });
  }, [scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return { animatedStyle, onPressIn, onPressOut };
}

export function useFadeIn(duration = 280) {
  const opacity = useSharedValue(0);
  const start = useCallback(() => {
    opacity.value = withTiming(1, { duration });
  }, [opacity, duration]);
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return { animatedStyle, start };
}
