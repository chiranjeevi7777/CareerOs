import { useState, useCallback } from 'react';

/**
 * Manages async fetch state: loading, data, error.
 *
 * @template T
 * @param {() => Promise<T>} fetchFn - The async function to call
 * @returns {{ data: T|null, loading: boolean, error: Error|null, execute: () => Promise<void> }}
 *
 * Usage:
 *   const { data, loading, execute } = useAsyncFetch(
 *     () => apiClient.post('/api/analytics-insights', payload)
 *   );
 */
export const useAsyncFetch = (fetchFn) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (e) {
      setError(e);
      console.error('[useAsyncFetch]', e);
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  return { data, loading, error, execute };
};
