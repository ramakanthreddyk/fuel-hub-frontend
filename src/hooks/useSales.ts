
import { useQuery } from '@tanstack/react-query';
import { salesApi, SalesFilters } from '@/api/sales';

export const useSales = (filters: SalesFilters = {}) => {
  return useQuery({
    queryKey: ['sales', filters],
    queryFn: () => salesApi.getSales(filters),
  });
};
