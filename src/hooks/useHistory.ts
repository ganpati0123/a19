/**
 * Generic recent-items history backed by AsyncStorage.
 *
 * Supports multiple buckets so the same hook can power recent contacts,
 * recent merchants, recent searches, etc.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { readJson, StorageKeys, writeJson } from '@utils/storage';

export type HistoryBucket =
  | 'contact'
  | 'merchant'
  | 'search'
  | 'screen'
  | 'recharge'
  | 'mf'
  | 'gold'
  | 'category';

export type HistoryState = Record<HistoryBucket, string[]>;

export const emptyHistory: HistoryState = {
  contact: [],
  merchant: [],
  search: [],
  screen: [],
  recharge: [],
  mf: [],
  gold: [],
  category: [],
};

let cache: HistoryState | null = null;
const subs = new Set<(s: HistoryState) => void>();

async function load(): Promise<HistoryState> {
  if (cache) return cache;
  cache = await readJson<HistoryState>(StorageKeys.history, emptyHistory);
  return cache;
}

function persist(next: HistoryState) {
  cache = next;
  writeJson(StorageKeys.history, next).catch(() => {});
  subs.forEach((s) => s(next));
}

const MAX = 25;

export function useHistory() {
  const [state, setState] = useState<HistoryState>(cache ?? emptyHistory);

  useEffect(() => {
    let mounted = true;
    if (!cache) {
      load().then((v) => mounted && setState(v));
    }
    const sub = (v: HistoryState) => mounted && setState(v);
    subs.add(sub);
    return () => {
      mounted = false;
      subs.delete(sub);
    };
  }, []);

  const push = useCallback((bucket: HistoryBucket, id: string) => {
    const current = cache ?? emptyHistory;
    const list = current[bucket].filter((x) => x !== id);
    list.unshift(id);
    persist({ ...current, [bucket]: list.slice(0, MAX) });
  }, []);

  const remove = useCallback((bucket: HistoryBucket, id: string) => {
    const current = cache ?? emptyHistory;
    persist({ ...current, [bucket]: current[bucket].filter((x) => x !== id) });
  }, []);

  const clear = useCallback((bucket?: HistoryBucket) => {
    if (!bucket) {
      persist(emptyHistory);
      return;
    }
    const current = cache ?? emptyHistory;
    persist({ ...current, [bucket]: [] });
  }, []);

  return useMemo(() => ({ history: state, push, remove, clear }), [state, push, remove, clear]);
}
