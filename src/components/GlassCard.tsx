/**
 * Glassmorphism card: a frosted background with a thin highlight border.
 *
 * On native we use `expo-blur`'s BlurView; on Android the blur falls back
 * to a translucent fill so the card still looks premium without GPU
 * blur support.
 */

import React from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@theme/ThemeProvider';

export interface GlassCardProps {
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  borderless?: boolean;
}

export function GlassCard({
  intensity = 30,
  tint,
  style,
  children,
  borderless = false,
}: GlassCardProps) {
  const theme = useTheme();
  const resolvedTint: 'light' | 'dark' | 'default' = tint ?? (theme.isDark ? 'dark' : 'light');
  const borderColor = theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.7)';

  if (Platform.OS === 'android') {
    return (
      <View
        style={[
          styles.base,
          {
            backgroundColor: theme.colors.glassTint,
            borderColor: borderless ? 'transparent' : borderColor,
            borderWidth: borderless ? 0 : StyleSheet.hairlineWidth,
          },
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <BlurView
      intensity={intensity}
      tint={resolvedTint}
      style={[
        styles.base,
        {
          borderColor: borderless ? 'transparent' : borderColor,
          borderWidth: borderless ? 0 : StyleSheet.hairlineWidth,
          backgroundColor: theme.colors.glassTint,
        },
        style,
      ]}
    >
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 20,
    overflow: 'hidden',
  },
});
