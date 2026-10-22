import { useCallback, useEffect, useState } from 'react';

interface UseAsyncDataResult<T> {
  data: T | undefined;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Shared hook used by pages to load mock/service data with consistent
 * loading, error, and retry semantics instead of re-implementing the same
 * pattern on every page.
 */
export function useAsyncData<T>(loader: () => Promise<T>, deps: unknown[] = []): UseAsyncDataResult<T> {
  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const load = useCallback(() => {
    let isCancelled = false;
    setIsLoading(true);
    setError(null);

    loader()
      .then((result) => {
        if (!isCancelled) {
          setData(result);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setError('Failed to load data. Please try again.');
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadToken]);

  useEffect(() => {
    const cancel = load();
    return cancel;
  }, [load]);

  const refetch = (): void => setReloadToken((token) => token + 1);

  return { data, isLoading, error, refetch };
}
