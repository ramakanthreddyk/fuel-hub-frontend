import { useApi, API_CONFIG } from '@/contexts/ApiContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Helper to normalize array responses
const ensureArray = (data: any): any[] => {
  if (Array.isArray(data)) return data;
  if (data?.data?.nozzles && Array.isArray(data.data.nozzles)) return data.data.nozzles;
  if (data?.nozzles && Array.isArray(data.nozzles)) return data.nozzles;
  if (data?.data && Array.isArray(data.data)) return data.data;
  return [];
};

export const useFetchData = <T,>(endpoint: string, queryKey: any[], options: any = {}) => {
  const { fetchApi } = useApi();
  return useQuery<T>({
    queryKey,
    queryFn: () => fetchApi<T>(endpoint, options),
    ...options,
    select:
      options.select ||
      (endpoint.includes('nozzles') || endpoint.includes('pumps') || endpoint.includes('stations')
        ? (data: any) => ensureArray(data) as unknown as T
        : undefined),
  });
};

export const useApiMutation = <T, D = any>(
  endpoint: string,
  options: {
    method?: string;
    invalidateQueries?: any[];
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
  } = {},
) => {
  const { fetchApi } = useApi();
  const queryClient = useQueryClient();
  const { method = 'POST', invalidateQueries = [], onSuccess, onError } = options;

  return useMutation<T, Error, D>({
    mutationFn: (data: D) =>
      fetchApi<T>(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      if (invalidateQueries.length > 0) {
        invalidateQueries.forEach((query) => {
          queryClient.invalidateQueries({ queryKey: query });
        });
      }
      onSuccess?.(data);
    },
    onError: (error) => {
      onError?.(error);
    },
  });
};

export const apiEndpoints = API_CONFIG.endpoints;
