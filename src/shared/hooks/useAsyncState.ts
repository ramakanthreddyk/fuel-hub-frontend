/**
 * @file shared/hooks/useAsyncState.ts
 * @description Generic hook for managing async operations state
 */

import { useState, useCallback } from 'react';

interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

interface AsyncActions<T> {
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
  setData: (data: T) => void;
  setError: (error: string) => void;
}

export function useAsyncState<T>(
  asyncFunction?: (...args: any[]) => Promise<T>
): AsyncState<T> & AsyncActions<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]): Promise<T> => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        
        const result = asyncFunction 
          ? await asyncFunction(...args)
          : args[0]; // If no function provided, use first argument as result
          
        setState(prev => ({ ...prev, data: result, isLoading: false }));
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
        throw err;
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null });
  }, []);

  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, data }));
  }, []);

  const setError = useCallback((error: string) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    setData,
    setError,
  };
}
