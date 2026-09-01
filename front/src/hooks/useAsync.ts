import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '../api/http';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAsync<T>(
  fn: () => Promise<T>,
  deps: unknown[],
): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const run = useCallback(() => {
    const id = ++requestId.current;
    setLoading(true);
    setError(null);
    fn()
      .then((result) => {
        if (requestId.current === id) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (requestId.current === id) {
          setError(
            err instanceof ApiError
              ? err.details.join(' ')
              : 'Une erreur est survenue.',
          );
          setLoading(false);
        }
      });
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  return { data, loading, error, refetch: run };
}
