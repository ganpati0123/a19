/**
 * Spacing scale used across the entire app.
 *
 * The scale follows a 4pt grid which keeps all paddings, margins and gaps
 * visually harmonious. Always prefer values from `spacing` over
 * arbitrary numbers in styles.
 */

export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  giant: 56,
  colossal: 80,
} as const;

export type SpacingKey = keyof typeof spacing;

export function pad(...args: SpacingKey[]): {
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
} {
  if (args.length === 1) {
    const v = spacing[args[0]];
    return { paddingTop: v, paddingRight: v, paddingBottom: v, paddingLeft: v };
  }
  if (args.length === 2) {
    const [v, h] = args;
    return {
      paddingTop: spacing[v],
      paddingBottom: spacing[v],
      paddingLeft: spacing[h],
      paddingRight: spacing[h],
    };
  }
  if (args.length === 3) {
    const [t, h, b] = args;
    return {
      paddingTop: spacing[t],
      paddingLeft: spacing[h],
      paddingRight: spacing[h],
      paddingBottom: spacing[b],
    };
  }
  const [t, r, b, l] = args;
  return {
    paddingTop: spacing[t],
    paddingRight: spacing[r],
    paddingBottom: spacing[b],
    paddingLeft: spacing[l],
  };
}

export const radii = {
  none: 0,
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 20,
  xxl: 28,
  pill: 999,
} as const;

export type RadiiKey = keyof typeof radii;

export const hitSlop = {
  s: { top: 8, bottom: 8, left: 8, right: 8 },
  m: { top: 12, bottom: 12, left: 12, right: 12 },
  l: { top: 16, bottom: 16, left: 16, right: 16 },
} as const;
