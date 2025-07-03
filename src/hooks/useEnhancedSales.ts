
import { useQuery } from '@tanstack/react-query';
import { salesApi } from '@/api/sales';
import { pumpsApi } from '@/api/pumps';

export const useEnhancedSales = (filters: any = {}) => {
  const { data: sales = [], isLoading: salesLoading, error: salesError } = useQuery({
    queryKey: ['sales', filters],
    queryFn: () => salesApi.getSales(filters),
  });

  const { data: pumps = [], isLoading: pumpsLoading } = useQuery({
    queryKey: ['pumps'],
    queryFn: () => pumpsApi.getPumps(),
  });

  const enhancedSales = sales.map(sale => ({
    ...sale,
    pump: pumps.find(p => p.id === sale.pumpId),
  }));

  return {
    data: enhancedSales,
    isLoading: salesLoading || pumpsLoading,
    error: salesError,
  };
};
