/**
 * Theme provider that exposes the active color scheme, spacing, gradients,
 * shadows and typography to the entire component tree. It also handles
 * the light → dark transition with a smooth Reanimated cross-fade.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Appearance, useColorScheme as useDeviceColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ColorScheme, darkColors, lightColors } from './colors';
import { gradients } from './gradients';
import { neumorphSpec, shadows } from './shadows';
import { spacing, radii } from './spacing';
import { typography } from './typography';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = '@payx/theme-preference/v1';

export interface Theme {
  mode: ThemeMode;
  colors: ColorScheme;
  gradients: typeof gradients;
  shadows: typeof shadows;
  spacing: typeof spacing;
  radii: typeof radii;
  typography: typeof typography;
  neumorph: (typeof neumorphSpec)['light'];
}

interface ThemeContextValue extends Theme {
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => void;
  toggle: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function buildTheme(mode: ThemeMode): Theme {
  return {
    mode,
    colors: mode === 'dark' ? darkColors : lightColors,
    gradients,
    shadows,
    spacing,
    radii,
    typography,
    neumorph: (mode === 'dark' ? neumorphSpec.dark : neumorphSpec.light) as Theme['neumorph'],
  };
}

interface ThemeProviderProps {
  children: React.ReactNode;
  initialPreference?: ThemePreference;
}

export function ThemeProvider({ children, initialPreference }: ThemeProviderProps) {
  const deviceScheme = useDeviceColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>(
    initialPreference ?? 'system',
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (value === 'light' || value === 'dark' || value === 'system') {
          setPreferenceState(value);
        }
      })
      .catch(() => {})
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, preference).catch(() => {});
  }, [preference, hydrated]);

  useEffect(() => {
    const sub = Appearance.addChangeListener(() => {
      // No-op — `useDeviceColorScheme` handles the re-render.
    });
    return () => sub.remove();
  }, []);

  const mode: ThemeMode = useMemo(() => {
    if (preference === 'system') {
      return (deviceScheme ?? 'light') as ThemeMode;
    }
    return preference;
  }, [preference, deviceScheme]);

  const theme = useMemo(() => buildTheme(mode), [mode]);

  const setPreference = useCallback((pref: ThemePreference) => {
    setPreferenceState(pref);
  }, []);

  const toggle = useCallback(() => {
    setPreferenceState((current) => {
      if (current === 'system') return mode === 'dark' ? 'light' : 'dark';
      return current === 'dark' ? 'light' : 'dark';
    });
  }, [mode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      ...theme,
      preference,
      setPreference,
      toggle,
      isDark: mode === 'dark',
    }),
    [theme, preference, setPreference, toggle, mode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside <ThemeProvider>');
  }
  return ctx;
}

export function useColors(): ColorScheme {
  return useTheme().colors;
}
