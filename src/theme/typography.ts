/**
 * Typography tokens.
 *
 * Each entry defines a complete text style — font size, line height,
 * font weight, and letter spacing. Importing this file gives screens a
 * single source of truth for type ramping.
 */

import { Platform, TextStyle } from 'react-native';

const sansFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

const monoFamily = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
});

interface TypeStyle extends TextStyle {
  fontFamily?: string;
}

export const typography = {
  display: {
    fontFamily: sansFamily,
    fontSize: 38,
    lineHeight: 44,
    fontWeight: '800' as TextStyle['fontWeight'],
    letterSpacing: -0.5,
  } satisfies TypeStyle,
  hero: {
    fontFamily: sansFamily,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800' as TextStyle['fontWeight'],
    letterSpacing: -0.4,
  } satisfies TypeStyle,
  h1: {
    fontFamily: sansFamily,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: -0.2,
  } satisfies TypeStyle,
  h2: {
    fontFamily: sansFamily,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: -0.1,
  } satisfies TypeStyle,
  h3: {
    fontFamily: sansFamily,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700' as TextStyle['fontWeight'],
  } satisfies TypeStyle,
  title: {
    fontFamily: sansFamily,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600' as TextStyle['fontWeight'],
  } satisfies TypeStyle,
  subtitle: {
    fontFamily: sansFamily,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600' as TextStyle['fontWeight'],
  } satisfies TypeStyle,
  body: {
    fontFamily: sansFamily,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as TextStyle['fontWeight'],
  } satisfies TypeStyle,
  bodyStrong: {
    fontFamily: sansFamily,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600' as TextStyle['fontWeight'],
  } satisfies TypeStyle,
  caption: {
    fontFamily: sansFamily,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as TextStyle['fontWeight'],
  } satisfies TypeStyle,
  micro: {
    fontFamily: sansFamily,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0.4,
    textTransform: 'uppercase' as TextStyle['textTransform'],
  } satisfies TypeStyle,
  mono: {
    fontFamily: monoFamily,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500' as TextStyle['fontWeight'],
  } satisfies TypeStyle,
  numeric: {
    fontFamily: sansFamily,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800' as TextStyle['fontWeight'],
    letterSpacing: -0.5,
  } satisfies TypeStyle,
  numericLarge: {
    fontFamily: sansFamily,
    fontSize: 48,
    lineHeight: 56,
    fontWeight: '800' as TextStyle['fontWeight'],
    letterSpacing: -1,
  } satisfies TypeStyle,
} as const;

export type TypographyKey = keyof typeof typography;
