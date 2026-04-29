import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Gradient, gradients, GradientKey } from '@theme/gradients';

export interface GradientCardProps {
  gradient?: GradientKey | Gradient;
  style?: StyleProp<ViewStyle>;
  radius?: number;
  children?: React.ReactNode;
}

function resolve(g: GradientKey | Gradient | undefined): Gradient {
  if (!g) return gradients.primary;
  if (typeof g === 'string') return gradients[g];
  return g;
}

export function GradientCard({ gradient, style, radius = 20, children }: GradientCardProps) {
  const g = resolve(gradient);
  return (
    <LinearGradient
      colors={g.colors as readonly [string, string, ...string[]]}
      start={g.start}
      end={g.end}
      style={[styles.base, { borderRadius: radius }, style]}
    >
      <View style={styles.content}>{children}</View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
  content: {
    flex: 0,
  },
});
