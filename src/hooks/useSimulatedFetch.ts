/**
 * Simulates an asynchronous data fetch with skeleton-friendly states.
 *
 * Designed so screens can render `isLoading`, `isRefreshing` and
 * `data` exactly the same way a real API hook (e.g. React Query) would —
 * but without any network or backend.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { sleep } from '@utils/sleep';

export interface FetchOptions<T> {
  initial?: T | null;
  delayMs?: number;
  refreshDelayMs?: number;
  paginated?: boolean;
}

export interface FetchResult<T> {
  data: T | null;
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  loadMore: (next: () => Promise<T>) => Promise<void>;
  reset: () => void;
  setData: (next: T | null) => void;
}

export function useSimulatedFetch<T>(
  fetcher: () => Promise<T>,
  options: FetchOptions<T> = {},
): FetchResult<T> {
  const { initial = null, delayMs = 700, refreshDelayMs = 500 } = options;
  const [data, setData] = useState<T | null>(initial);
  const [isLoading, setIsLoading] = useState<boolean>(initial == null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const aliveRef = useRef(true);

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);

  const run = useCallback(
    async (delay: number, refresh: boolean) => {
      try {
        if (refresh) setIsRefreshing(true);
        else setIsLoading(true);
        setError(null);
        await sleep(delay);
        const result = await fetcher();
        if (!aliveRef.current) return;
        setData(result);
      } catch (err) {
        if (!aliveRef.current) return;
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (!aliveRef.current) return;
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [fetcher],
  );

  useEffect(() => {
    if (initial == null) {
      run(delayMs, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = useCallback(async () => {
    await run(refreshDelayMs, true);
  }, [run, refreshDelayMs]);

  const loadMore = useCallback(async (next: () => Promise<T>) => {
    try {
      setIsLoadingMore(true);
      await sleep(500);
      const result = await next();
      if (!aliveRef.current) return;
      setData(result);
    } finally {
      if (aliveRef.current) setIsLoadingMore(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(initial);
    setError(null);
    setIsLoading(true);
    run(delayMs, false);
  }, [initial, delayMs, run]);

  return useMemo(
    () => ({
      data,
      isLoading,
      isRefreshing,
      isLoadingMore,
      error,
      refresh,
      loadMore,
      reset,
      setData,
    }),
    [data, isLoading, isRefreshing, isLoadingMore, error, refresh, loadMore, reset],
  );
}
