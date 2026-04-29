/**
 * Cross-platform shadow presets used to build neumorphism + glass cards.
 *
 * iOS uses native `shadow*` properties while Android relies on `elevation`.
 * On web we emit `boxShadow` strings via stylesheet helper.
 */

import { Platform, ViewStyle } from 'react-native';

interface ShadowSpec {
  color: string;
  offsetX: number;
  offsetY: number;
  opacity: number;
  radius: number;
  elevation: number;
}

function shadow(spec: ShadowSpec): ViewStyle {
  return Platform.select({
    ios: {
      shadowColor: spec.color,
      shadowOffset: { width: spec.offsetX, height: spec.offsetY },
      shadowOpacity: spec.opacity,
      shadowRadius: spec.radius,
    },
    android: {
      elevation: spec.elevation,
      shadowColor: spec.color,
    },
    default: {
      shadowColor: spec.color,
      shadowOffset: { width: spec.offsetX, height: spec.offsetY },
      shadowOpacity: spec.opacity,
      shadowRadius: spec.radius,
    },
  }) as ViewStyle;
}

export const shadows = {
  none: shadow({ color: 'transparent', offsetX: 0, offsetY: 0, opacity: 0, radius: 0, elevation: 0 }),
  xs: shadow({ color: '#0B1020', offsetX: 0, offsetY: 1, opacity: 0.06, radius: 2, elevation: 1 }),
  sm: shadow({ color: '#0B1020', offsetX: 0, offsetY: 2, opacity: 0.08, radius: 4, elevation: 2 }),
  md: shadow({ color: '#0B1020', offsetX: 0, offsetY: 4, opacity: 0.1, radius: 8, elevation: 4 }),
  lg: shadow({ color: '#0B1020', offsetX: 0, offsetY: 8, opacity: 0.12, radius: 16, elevation: 8 }),
  xl: shadow({ color: '#0B1020', offsetX: 0, offsetY: 14, opacity: 0.16, radius: 28, elevation: 14 }),
  xxl: shadow({ color: '#0B1020', offsetX: 0, offsetY: 22, opacity: 0.2, radius: 40, elevation: 20 }),
  glow: shadow({ color: '#5A4BFF', offsetX: 0, offsetY: 8, opacity: 0.4, radius: 24, elevation: 14 }),
  glowDark: shadow({ color: '#8E84FF', offsetX: 0, offsetY: 8, opacity: 0.45, radius: 28, elevation: 14 }),
  neumorph: shadow({ color: '#0B1020', offsetX: 6, offsetY: 8, opacity: 0.12, radius: 14, elevation: 6 }),
} as const;

export type ShadowKey = keyof typeof shadows;

/**
 * A pair of inner/outer shadows that approximate Neumorphism.
 *
 * Use one of these blocks behind a light surface to create the
 * characteristic "soft pressed" effect. We render two stacked Views to
 * compose this on platforms that don't support inset shadows.
 */
export const neumorphSpec = {
  light: {
    bright: 'rgba(255,255,255,0.9)',
    dark: 'rgba(15,23,42,0.12)',
    offset: 8,
    radius: 18,
  },
  dark: {
    bright: 'rgba(120,130,180,0.12)',
    dark: 'rgba(0,0,0,0.55)',
    offset: 8,
    radius: 22,
  },
} as const;
