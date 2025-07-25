import { useQuery } from '@tanstack/react-query';
import { todaysSalesService, TodaysSalesSummary } from '@/api/services/todaysSalesService';

export const useTodaysSales = (date?: string) => {
  return useQuery<TodaysSalesSummary>({
    queryKey: ['todays-sales', date],
    queryFn: () => todaysSalesService.getTodaysSummary(date),
    staleTime: 60000, // 1 minute
    refetchInterval: 300000, // 5 minutes
  });
};