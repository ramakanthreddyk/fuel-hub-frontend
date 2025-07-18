/**
 * @file hooks/api/useSales.ts
 * @description React Query hooks for sales API
 */
import { useQuery } from '@tanstack/react-query';
import { salesService, SalesFilters } from '@/api/services/salesService';
import { useErrorHandler } from '../useErrorHandler';

/**
 * Hook to fetch sales
 */
export const useSales = (filters: SalesFilters = {}) => {
  const { handleError } = useErrorHandler();
  return useQuery({
    queryKey: ['sales', filters],
    queryFn: () => salesService.getSales(filters),
    staleTime: 60000, // 1 minute
    onError: (error) => {
      handleError(error, 'Failed to fetch sales.');
    },
  });
};