/**
 * Pressable wrapper that animates a `scale` + `opacity` transform on
 * touch using Reanimated. Adds optional haptic feedback so every
 * interactive element in the app feels lively.
 */

import React, { useCallback } from 'react';
import { Pressable, PressableProps, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import Animated from 'react-native-reanimated';
import { useAnimatedPress } from '@hooks/useAnimatedPress';
import { useHaptics, HapticsStyle } from '@hooks/useHaptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface PressableScaleProps extends Omit<PressableProps, 'style'> {
  scaleTo?: number;
  opacityTo?: number;
  haptic?: HapticsStyle | false;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export function PressableScale({
  onPress,
  onPressIn,
  onPressOut,
  scaleTo = 0.96,
  opacityTo = 0.9,
  haptic = 'light',
  style,
  children,
  ...rest
}: PressableScaleProps) {
  const { animatedStyle, onPressIn: animIn, onPressOut: animOut } = useAnimatedPress({
    scaleTo,
    opacityTo,
  });
  const trigger = useHaptics();

  const handlePressIn = useCallback(
    (e: Parameters<NonNullable<PressableProps['onPressIn']>>[0]) => {
      animIn();
      onPressIn?.(e);
    },
    [animIn, onPressIn],
  );

  const handlePressOut = useCallback(
    (e: Parameters<NonNullable<PressableProps['onPressOut']>>[0]) => {
      animOut();
      onPressOut?.(e);
    },
    [animOut, onPressOut],
  );

  const handlePress = useCallback(
    (e: Parameters<NonNullable<PressableProps['onPress']>>[0]) => {
      if (haptic) {
        trigger(haptic);
      }
      onPress?.(e);
    },
    [haptic, onPress, trigger],
  );

  return (
    <AnimatedPressable
      {...rest}
      style={[animatedStyle, style as ViewStyle]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {children}
    </AnimatedPressable>
  );
}

export const pressableScaleStyles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});
