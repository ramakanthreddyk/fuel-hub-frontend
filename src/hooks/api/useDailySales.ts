/**
 * @file hooks/api/useDailySales.ts
 * @description React Query hooks for daily sales API
 */
import { useQuery } from '@tanstack/react-query';
import { dailySalesService, DailySalesReport } from '@/api/services/dailySalesService';

/**
 * Hook to fetch daily sales report
 */
export const useDailySales = (date: string) => {
  return useQuery({
    queryKey: ['daily-sales', date],
    queryFn: () => dailySalesService.getDailySales(date),
    enabled: !!date,
    staleTime: 300000, // 5 minutes
    retry: 2
  });
};