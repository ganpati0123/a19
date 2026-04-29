/**
 * PayX Ultra Pro — Color System
 *
 * A premium, accessibility-aware color system that powers the entire
 * application. The palette is structured around a primary brand identity
 * (deep violet → electric blue) layered on top of carefully tuned neutrals
 * for the light theme and richly saturated charcoals for the dark theme.
 *
 * Every screen pulls its color values from `useTheme()` so that adding
 * a new theme (e.g. "AMOLED black" or a holiday seasonal theme) is a
 * matter of registering a new entry in this file.
 */

export type ColorName =
  | 'background'
  | 'surface'
  | 'surfaceElevated'
  | 'surfaceMuted'
  | 'border'
  | 'borderStrong'
  | 'text'
  | 'textMuted'
  | 'textSubtle'
  | 'textInverted'
  | 'primary'
  | 'primarySoft'
  | 'primaryStrong'
  | 'accent'
  | 'accentSoft'
  | 'success'
  | 'successSoft'
  | 'danger'
  | 'dangerSoft'
  | 'warning'
  | 'warningSoft'
  | 'info'
  | 'infoSoft'
  | 'gold'
  | 'goldSoft'
  | 'silver'
  | 'platinum'
  | 'glassTint'
  | 'glassBorder'
  | 'shadowSoft'
  | 'shadowStrong'
  | 'highlight'
  | 'overlay'
  | 'tabBar'
  | 'tabBarActive'
  | 'tabBarInactive'
  | 'sheetHandle'
  | 'inputBackground'
  | 'inputBorder'
  | 'inputBorderFocused'
  | 'placeholder'
  | 'skeleton'
  | 'skeletonShimmer';

export interface ColorScheme {
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceMuted: string;
  border: string;
  borderStrong: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  textInverted: string;
  primary: string;
  primarySoft: string;
  primaryStrong: string;
  accent: string;
  accentSoft: string;
  success: string;
  successSoft: string;
  danger: string;
  dangerSoft: string;
  warning: string;
  warningSoft: string;
  info: string;
  infoSoft: string;
  gold: string;
  goldSoft: string;
  silver: string;
  platinum: string;
  glassTint: string;
  glassBorder: string;
  shadowSoft: string;
  shadowStrong: string;
  highlight: string;
  overlay: string;
  tabBar: string;
  tabBarActive: string;
  tabBarInactive: string;
  sheetHandle: string;
  inputBackground: string;
  inputBorder: string;
  inputBorderFocused: string;
  placeholder: string;
  skeleton: string;
  skeletonShimmer: string;
}

/**
 * Light theme — calm, premium fintech tone with crisp violets and a paper
 * background. Tuned to look excellent under both AMOLED and IPS displays.
 */
export const lightColors: ColorScheme = {
  background: '#F4F6FB',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceMuted: '#EEF1F8',
  border: '#E3E7EF',
  borderStrong: '#C8CFDD',
  text: '#0B1020',
  textMuted: '#4B546B',
  textSubtle: '#7A8299',
  textInverted: '#FFFFFF',
  primary: '#5A4BFF',
  primarySoft: '#E7E4FF',
  primaryStrong: '#3E2EE0',
  accent: '#1FB6FF',
  accentSoft: '#D6F0FF',
  success: '#1BB76E',
  successSoft: '#D6F4E2',
  danger: '#E5484D',
  dangerSoft: '#FBE2E3',
  warning: '#F4A622',
  warningSoft: '#FCEBC9',
  info: '#3D8BFF',
  infoSoft: '#E0EBFF',
  gold: '#D4A23A',
  goldSoft: '#FBEFCB',
  silver: '#B4B8C7',
  platinum: '#E7EAF1',
  glassTint: 'rgba(255, 255, 255, 0.55)',
  glassBorder: 'rgba(255, 255, 255, 0.65)',
  shadowSoft: 'rgba(15, 23, 42, 0.08)',
  shadowStrong: 'rgba(15, 23, 42, 0.16)',
  highlight: 'rgba(90, 75, 255, 0.12)',
  overlay: 'rgba(11, 16, 32, 0.45)',
  tabBar: 'rgba(255, 255, 255, 0.85)',
  tabBarActive: '#5A4BFF',
  tabBarInactive: '#7A8299',
  sheetHandle: '#C8CFDD',
  inputBackground: '#FFFFFF',
  inputBorder: '#E3E7EF',
  inputBorderFocused: '#5A4BFF',
  placeholder: '#9AA1B4',
  skeleton: '#E3E7EF',
  skeletonShimmer: '#F0F2F8',
};

/**
 * Dark theme — deep midnight with electric primaries.
 */
export const darkColors: ColorScheme = {
  background: '#070A14',
  surface: '#10162A',
  surfaceElevated: '#161D34',
  surfaceMuted: '#0C1224',
  border: '#1C2440',
  borderStrong: '#2B355A',
  text: '#F4F6FB',
  textMuted: '#9AA3BF',
  textSubtle: '#6B7390',
  textInverted: '#0B1020',
  primary: '#8E84FF',
  primarySoft: '#272454',
  primaryStrong: '#B8B0FF',
  accent: '#3FCBFF',
  accentSoft: '#0E2D44',
  success: '#3CDB95',
  successSoft: '#0F2E22',
  danger: '#FF5C66',
  dangerSoft: '#3B1419',
  warning: '#FFC061',
  warningSoft: '#3A2A0E',
  info: '#6FA9FF',
  infoSoft: '#152544',
  gold: '#F0C766',
  goldSoft: '#332810',
  silver: '#B4B8C7',
  platinum: '#1F2740',
  glassTint: 'rgba(20, 26, 46, 0.55)',
  glassBorder: 'rgba(120, 130, 180, 0.18)',
  shadowSoft: 'rgba(0, 0, 0, 0.45)',
  shadowStrong: 'rgba(0, 0, 0, 0.7)',
  highlight: 'rgba(142, 132, 255, 0.16)',
  overlay: 'rgba(2, 4, 12, 0.65)',
  tabBar: 'rgba(16, 22, 42, 0.92)',
  tabBarActive: '#B8B0FF',
  tabBarInactive: '#6B7390',
  sheetHandle: '#2B355A',
  inputBackground: '#10162A',
  inputBorder: '#1C2440',
  inputBorderFocused: '#8E84FF',
  placeholder: '#5C6584',
  skeleton: '#161D34',
  skeletonShimmer: '#1C2440',
};

/**
 * Helper that resolves a color name regardless of the current scheme.
 */
export function resolveColor(scheme: ColorScheme, name: ColorName): string {
  return scheme[name];
}

/**
 * Returns a scheme by name. Useful when forcing a specific theme on a
 * subtree (e.g. always-dark receipts).
 */
export function getScheme(mode: 'light' | 'dark'): ColorScheme {
  return mode === 'dark' ? darkColors : lightColors;
}

/**
 * Adds an alpha channel to a hex color and returns an `rgba(...)` string.
 * Handles 3, 6 and 8 character hex values.
 */
export function withAlpha(hex: string, alpha: number): string {
  let value = hex.replace('#', '');
  if (value.length === 3) {
    value = value
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (value.length === 8) {
    value = value.slice(0, 6);
  }
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Linearly interpolates between two hex colors. Useful for animated
 * theme transitions where we want to blend between the light and dark
 * versions of a particular semantic color.
 */
export function mixHex(a: string, b: string, t: number): string {
  const parse = (h: string) => {
    let v = h.replace('#', '');
    if (v.length === 3) v = v.split('').map((c) => c + c).join('');
    return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
  };
  const [r1, g1, b1] = parse(a);
  const [r2, g2, b2] = parse(b);
  const lerp = (x: number, y: number) => Math.round(x + (y - x) * Math.min(1, Math.max(0, t)));
  const r = lerp(r1, r2);
  const g = lerp(g1, g2);
  const b3 = lerp(b1, b2);
  return `rgb(${r}, ${g}, ${b3})`;
}

/**
 * A static set of brand utility colors that do not flip between themes.
 */
export const brand = {
  violet: '#5A4BFF',
  violetSoft: '#A89EFF',
  blue: '#1FB6FF',
  pink: '#FF66C4',
  amber: '#F4A622',
  emerald: '#1BB76E',
  rose: '#E5484D',
  midnight: '#070A14',
  paper: '#F4F6FB',
} as const;
