/**
 * Neumorphism-style card with soft inset/outset shadows.
 *
 * Renders two stacked shadow layers around the surface to approximate the
 * dual-light neumorphism effect on platforms that don't natively support
 * inset shadows.
 */

import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '@theme/ThemeProvider';

export interface NeumorphCardProps {
  style?: StyleProp<ViewStyle>;
  pressed?: boolean;
  radius?: number;
  children?: React.ReactNode;
}

export function NeumorphCard({ style, pressed = false, radius = 20, children }: NeumorphCardProps) {
  const theme = useTheme();
  const spec = theme.neumorph;

  const outerShadow: ViewStyle = pressed
    ? {
        shadowColor: spec.dark,
        shadowOffset: { width: -spec.offset / 2, height: -spec.offset / 2 },
        shadowOpacity: 0.6,
        shadowRadius: spec.radius / 2,
        elevation: 4,
      }
    : {
        shadowColor: spec.dark,
        shadowOffset: { width: spec.offset, height: spec.offset },
        shadowOpacity: 0.6,
        shadowRadius: spec.radius,
        elevation: 8,
      };

  return (
    <View style={[{ borderRadius: radius }, outerShadow, style]}>
      <View
        style={[
          styles.inner,
          {
            backgroundColor: theme.colors.surface,
            borderRadius: radius,
            shadowColor: spec.bright,
            shadowOffset: { width: -spec.offset / 2, height: -spec.offset / 2 },
            shadowOpacity: 1,
            shadowRadius: spec.radius / 1.4,
            borderColor: theme.colors.border,
            borderWidth: theme.isDark ? StyleSheet.hairlineWidth : 0,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inner: {
    overflow: 'hidden',
  },
});
