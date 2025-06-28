
import { useQuery } from '@tanstack/react-query';
import { salesApi, SalesFilters } from '@/api/sales';

export const useSales = (filters: SalesFilters = {}) => {
  return useQuery({
    queryKey: ['sales', filters],
    queryFn: async () => {
      console.log('[USE-SALES] Fetching sales with filters:', filters);
      const result = await salesApi.getSales(filters);
      console.log('[USE-SALES] Query result:', result);
      return result;
    },
    retry: 1,
    staleTime: 30000, // 30 seconds
  });
};
