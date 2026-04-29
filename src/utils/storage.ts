/**
 * Tiny typed wrapper around AsyncStorage.
 *
 * All keys live in the `@payx/...` namespace so we don't collide with
 * unrelated apps that might share a sandbox during development.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = '@payx';

function k(key: string) {
  return `${PREFIX}/${key}`;
}

export async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(k(key));
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJson<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(k(key), JSON.stringify(value));
  } catch {
    // ignore — storage is best-effort
  }
}

export async function remove(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(k(key));
  } catch {
    // ignore
  }
}

export async function clearAll(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const ours = keys.filter((kk) => kk.startsWith(`${PREFIX}/`));
    await AsyncStorage.multiRemove(ours);
  } catch {
    // ignore
  }
}

export const StorageKeys = {
  themePreference: 'theme-preference/v1',
  favorites: 'favorites/v1',
  history: 'history/v1',
  settings: 'settings/v1',
  contacts: 'contacts/v1',
  recents: 'recents/v1',
  scanHistory: 'scan-history/v1',
  rechargeHistory: 'recharge-history/v1',
  goldHoldings: 'gold-holdings/v1',
  mfHoldings: 'mf-holdings/v1',
  insurancePolicies: 'insurance-policies/v1',
  notifications: 'notifications/v1',
  bankAccounts: 'bank-accounts/v1',
  cards: 'cards/v1',
  upiIds: 'upi-ids/v1',
  aiHistory: 'ai-history/v1',
  rewards: 'rewards/v1',
  referrals: 'referrals/v1',
  budgets: 'budgets/v1',
  goals: 'goals/v1',
} as const;
