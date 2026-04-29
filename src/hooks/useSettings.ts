/**
 * Global settings store backed by AsyncStorage.
 *
 * Keep `Settings` flat: every key here is bound to a toggle/select on the
 * Settings screen. New flags should be added with sensible defaults.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { readJson, StorageKeys, writeJson } from '@utils/storage';

export interface Settings {
  hapticsEnabled: boolean;
  notificationsEnabled: boolean;
  soundsEnabled: boolean;
  biometricEnabled: boolean;
  hideBalances: boolean;
  receiptsAutoSave: boolean;
  language: 'en' | 'hi' | 'mr' | 'ta' | 'te' | 'kn';
  defaultPaymentMethod: 'upi' | 'card' | 'wallet' | 'netbanking';
  spendLimit: number;
  scannerSensitivity: 'low' | 'medium' | 'high';
  aiAssistantEnabled: boolean;
  showSpendInsights: boolean;
  showCashbackBanners: boolean;
  privateMode: boolean;
  twoFactorEnabled: boolean;
  spendCategoryColors: boolean;
  receiptTheme: 'auto' | 'always-light' | 'always-dark';
  homeLayout: 'compact' | 'comfortable' | 'spacious';
  pinTimeout: 15 | 30 | 60 | 120;
  marketingOptIn: boolean;
}

export const defaultSettings: Settings = {
  hapticsEnabled: true,
  notificationsEnabled: true,
  soundsEnabled: false,
  biometricEnabled: true,
  hideBalances: false,
  receiptsAutoSave: true,
  language: 'en',
  defaultPaymentMethod: 'upi',
  spendLimit: 100000,
  scannerSensitivity: 'medium',
  aiAssistantEnabled: true,
  showSpendInsights: true,
  showCashbackBanners: true,
  privateMode: false,
  twoFactorEnabled: false,
  spendCategoryColors: true,
  receiptTheme: 'auto',
  homeLayout: 'comfortable',
  pinTimeout: 60,
  marketingOptIn: true,
};

let cache: Settings | null = null;
const subscribers = new Set<(s: Settings) => void>();

async function loadInitial(): Promise<Settings> {
  if (cache) return cache;
  const stored = await readJson<Partial<Settings>>(StorageKeys.settings, {});
  cache = { ...defaultSettings, ...stored };
  return cache;
}

function persist(next: Settings) {
  cache = next;
  writeJson(StorageKeys.settings, next).catch(() => {});
  subscribers.forEach((sub) => sub(next));
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(cache ?? defaultSettings);
  const [hydrated, setHydrated] = useState<boolean>(cache != null);

  useEffect(() => {
    let mounted = true;
    if (!cache) {
      loadInitial().then((value) => {
        if (mounted) {
          setSettings(value);
          setHydrated(true);
        }
      });
    }
    const sub = (value: Settings) => {
      if (mounted) setSettings(value);
    };
    subscribers.add(sub);
    return () => {
      mounted = false;
      subscribers.delete(sub);
    };
  }, []);

  const update = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    persist({ ...(cache ?? defaultSettings), [key]: value });
  }, []);

  const replace = useCallback((next: Partial<Settings>) => {
    persist({ ...(cache ?? defaultSettings), ...next });
  }, []);

  const reset = useCallback(() => {
    persist({ ...defaultSettings });
  }, []);

  return useMemo(
    () => ({ settings, hydrated, update, replace, reset }),
    [settings, hydrated, update, replace, reset],
  );
}
