/**
 * Tracks favorite IDs across various contexts (contacts, merchants, plans,
 * mutual funds, gold targets, etc.) using a single AsyncStorage record.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { readJson, StorageKeys, writeJson } from '@utils/storage';

export type FavoriteCategory =
  | 'contact'
  | 'merchant'
  | 'plan'
  | 'mf'
  | 'biller'
  | 'category'
  | 'screen';

export interface FavoritesState {
  contact: string[];
  merchant: string[];
  plan: string[];
  mf: string[];
  biller: string[];
  category: string[];
  screen: string[];
}

export const emptyFavorites: FavoritesState = {
  contact: [],
  merchant: [],
  plan: [],
  mf: [],
  biller: [],
  category: [],
  screen: [],
};

let cache: FavoritesState | null = null;
const subscribers = new Set<(s: FavoritesState) => void>();

async function loadInitial(): Promise<FavoritesState> {
  if (cache) return cache;
  cache = await readJson<FavoritesState>(StorageKeys.favorites, emptyFavorites);
  return cache;
}

function persist(next: FavoritesState) {
  cache = next;
  writeJson(StorageKeys.favorites, next).catch(() => {});
  subscribers.forEach((sub) => sub(next));
}

export function useFavorites() {
  const [state, setState] = useState<FavoritesState>(cache ?? emptyFavorites);

  useEffect(() => {
    let mounted = true;
    if (!cache) {
      loadInitial().then((value) => {
        if (mounted) setState(value);
      });
    }
    const sub = (value: FavoritesState) => {
      if (mounted) setState(value);
    };
    subscribers.add(sub);
    return () => {
      mounted = false;
      subscribers.delete(sub);
    };
  }, []);

  const has = useCallback(
    (category: FavoriteCategory, id: string) => state[category].includes(id),
    [state],
  );

  const toggle = useCallback(
    (category: FavoriteCategory, id: string) => {
      const current = cache ?? emptyFavorites;
      const list = current[category];
      const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
      persist({ ...current, [category]: next });
    },
    [],
  );

  const add = useCallback((category: FavoriteCategory, id: string) => {
    const current = cache ?? emptyFavorites;
    if (current[category].includes(id)) return;
    persist({ ...current, [category]: [...current[category], id] });
  }, []);

  const remove = useCallback((category: FavoriteCategory, id: string) => {
    const current = cache ?? emptyFavorites;
    persist({ ...current, [category]: current[category].filter((x) => x !== id) });
  }, []);

  const clear = useCallback((category?: FavoriteCategory) => {
    if (!category) {
      persist(emptyFavorites);
      return;
    }
    const current = cache ?? emptyFavorites;
    persist({ ...current, [category]: [] });
  }, []);

  return useMemo(
    () => ({ favorites: state, has, toggle, add, remove, clear }),
    [state, has, toggle, add, remove, clear],
  );
}
