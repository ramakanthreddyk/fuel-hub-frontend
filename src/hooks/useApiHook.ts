/**
 * @file useApiHook.ts
 * @description Custom hook for API operations using the ApiContext
 */
import { useApi, API_CONFIG } from '@/contexts/ApiContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Helper function to ensure array data
const ensureArray = (data: any): any[] => {
  if (Array.isArray(data)) return data;
  if (data?.data?.nozzles && Array.isArray(data.data.nozzles)) return data.data.nozzles;
  if (data?.nozzles && Array.isArray(data.nozzles)) return data.nozzles;
  if (data?.data && Array.isArray(data.data)) return data.data;
  return [];
};

/**
 * Hook for common API operations
 */
export function useApiHook() {
  const { fetchApi } = useApi();
  const queryClient = useQueryClient();

  /**
   * Fetch data from an API endpoint
   */
  const fetchData = <T,>(endpoint: string, queryKey: any[], options?: any) => {
    return useQuery<T>({
      queryKey,
      queryFn: () => fetchApi<T>(endpoint, options),
      ...options,
      // Add default select function for array data if endpoint contains certain keywords
      select: options?.select || (
        endpoint.includes('nozzles') || 
        endpoint.includes('pumps') || 
        endpoint.includes('stations') ? 
        (data: any) => ensureArray(data) as unknown as T : 
        undefined
      )
    });
  };

  /**
   * Create a mutation for API operations
   */
  const createMutation = <T, D = any>(
    endpoint: string, 
    options: {
      method?: string;
      invalidateQueries?: any[];
      onSuccess?: (data: T) => void;
      onError?: (error: any) => void;
    } = {}
  ) => {
    const { 
      method = 'POST', 
      invalidateQueries = [],
      onSuccess,
      onError
    } = options;

    return useMutation<T, Error, D>({
      mutationFn: (data: D) => fetchApi<T>(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }),
      onSuccess: (data) => {
        // Invalidate queries if specified
        if (invalidateQueries.length > 0) {
          invalidateQueries.forEach(query => {
            queryClient.invalidateQueries({ queryKey: query });
          });
        }
        
        // Call custom onSuccess handler if provided
        if (onSuccess) {
          onSuccess(data);
        }
      },
      onError: (error) => {
        // Call custom onError handler if provided
        if (onError) {
          onError(error);
        }
      }
    });
  };

  return {
    fetchData,
    createMutation,
    endpoints: API_CONFIG.endpoints
  };
}