
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useToastNotifications } from '@/hooks/useToastNotifications';
import { useAutoLoader } from '@/hooks/useAutoLoader';
import { handleApiResponse } from '@/api/responseHandler';
import { TodaysSalesSummary } from '@/api/api-contract';

export const useTodaysSales = (date?: string) => {
  const { handleApiError } = useToastNotifications();
  
  const query = useQuery({
    queryKey: ['todays-sales', date],
    queryFn: async (): Promise<TodaysSalesSummary> => {
      const params = new URLSearchParams();
      if (date) {
        params.append('date', date);
      }
      
      return handleApiResponse(() => 
        apiClient.get(`/todays-sales/summary${params.toString() ? '?' + params.toString() : ''}`)
      );
    },
    staleTime: 300000, // 5 minutes
    onError: (error) => {
      handleApiError(error, 'Today\'s Sales');
    },
  });
  
  useAutoLoader(query.isLoading, 'Loading today\'s sales...');
  return query;
};
