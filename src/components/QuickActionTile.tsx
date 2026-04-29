import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Gradient, gradients, GradientKey } from '@theme/gradients';
import { useTheme } from '@theme/ThemeProvider';
import { PressableScale } from './PressableScale';

export interface QuickActionTileProps {
  emoji: string;
  label: string;
  caption?: string;
  gradient?: GradientKey | Gradient;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  size?: 'sm' | 'md';
}

function resolve(g?: GradientKey | Gradient): Gradient {
  if (!g) return gradients.primary;
  if (typeof g === 'string') return gradients[g];
  return g;
}

export function QuickActionTile({ emoji, label, caption, gradient, onPress, style, size = 'md' }: QuickActionTileProps) {
  const theme = useTheme();
  const g = resolve(gradient);
  const dim = size === 'md' ? 84 : 68;
  return (
    <PressableScale
      onPress={onPress}
      haptic="light"
      style={[styles.container, style]}
    >
      <LinearGradient
        colors={g.colors as readonly [string, string, ...string[]]}
        start={g.start}
        end={g.end}
        style={[styles.tile, { width: dim, height: dim, borderRadius: 20 }]}
      >
        <Text style={[styles.emoji, { fontSize: size === 'md' ? 30 : 24 }]}>{emoji}</Text>
      </LinearGradient>
      <Text style={[styles.label, { color: theme.colors.text }]} numberOfLines={1}>
        {label}
      </Text>
      {caption ? (
        <Text style={[styles.caption, { color: theme.colors.textMuted }]} numberOfLines={1}>
          {caption}
        </Text>
      ) : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 84,
  },
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emoji: {
    color: '#fff',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  caption: {
    fontSize: 10,
    marginTop: 2,
  },
});
