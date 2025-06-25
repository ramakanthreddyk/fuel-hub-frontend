
import { useState, useCallback } from 'react';
import { useError } from '@/contexts/ErrorContext';
import { toast } from '@/hooks/use-toast';

interface UseAsyncOperationOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  successMessage?: string;
  errorMessage?: string;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

export const useAsyncOperation = (options: UseAsyncOperationOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { handleApiError } = useError();

  const execute = useCallback(async (asyncFn: () => Promise<any>) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await asyncFn();
      
      if (options.onSuccess) {
        options.onSuccess(result);
      }
      
      if (options.showSuccessToast !== false && options.successMessage) {
        toast({
          title: "Success",
          description: options.successMessage,
          variant: "default",
        });
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      setError(error);
      
      if (options.onError) {
        options.onError(error);
      } else if (options.showErrorToast !== false) {
        handleApiError(error, options.errorMessage);
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [options, handleApiError]);

  return {
    execute,
    isLoading,
    error,
    clearError: () => setError(null),
  };
};
