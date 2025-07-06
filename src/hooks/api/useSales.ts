/**
 * @file hooks/api/useSales.ts
 * @description React Query hooks for sales API
 */
import { useQuery } from '@tanstack/react-query';
import { salesService, SalesFilters } from '@/api/services/salesService';

/**
 * Hook to fetch sales
 */
export const useSales = (filters: SalesFilters = {}) => {
  return useQuery({
    queryKey: ['sales', filters],
    queryFn: () => salesService.getSales(filters),
    staleTime: 60000, // 1 minute
  });
};