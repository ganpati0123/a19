import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { initials as toInitials } from '@utils/format';
import { colorFor } from '@utils/random';

export interface AvatarProps {
  name?: string;
  size?: number;
  initials?: string;
  color?: string;
  badge?: string;
  badgeColor?: string;
  style?: StyleProp<ViewStyle>;
  square?: boolean;
}

export function Avatar({ name, size = 48, initials, color, badge, badgeColor, style, square }: AvatarProps) {
  const text = (initials ?? toInitials(name ?? '?')).toUpperCase();
  const bg = color ?? colorFor(name ?? text);
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: square ? 14 : size / 2,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={[bg, shade(bg, -0.25)] as readonly [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.fill,
          {
            borderRadius: square ? 14 : size / 2,
          },
        ]}
      >
        <Text style={[styles.text, { fontSize: Math.round(size * 0.36) }]}>{text}</Text>
      </LinearGradient>
      {badge ? (
        <View
          style={[
            styles.badge,
            {
              backgroundColor: badgeColor ?? '#1BB76E',
              minWidth: 18,
              height: 18,
              borderRadius: 9,
              right: -2,
              bottom: -2,
            },
          ]}
        >
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}
    </View>
  );
}

function shade(hex: string, percent: number): string {
  let v = hex.replace('#', '');
  if (v.length === 3) v = v.split('').map((c) => c + c).join('');
  const r = Math.max(0, Math.min(255, parseInt(v.slice(0, 2), 16) + Math.round(255 * percent)));
  const g = Math.max(0, Math.min(255, parseInt(v.slice(2, 4), 16) + Math.round(255 * percent)));
  const b = Math.max(0, Math.min(255, parseInt(v.slice(4, 6), 16) + Math.round(255 * percent)));
  return `rgb(${r}, ${g}, ${b})`;
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  badge: {
    position: 'absolute',
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#fff',
    borderWidth: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
  },
});
