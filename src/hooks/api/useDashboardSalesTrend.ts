import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useToastNotifications } from '@/hooks/useToastNotifications';
import { useAutoLoader } from '@/hooks/useAutoLoader';
import { handleApiResponse } from '@/api/responseHandler';

interface SalesTrendData {
  date: string;
  amount: number;
  volume: number;
}

export const useDashboardSalesTrend = (days: number = 7) => {
  const { handleApiError } = useToastNotifications();
  
  const query = useQuery({
    queryKey: ['dashboard-sales-trend', days],
    queryFn: async (): Promise<SalesTrendData[]> => {
      return handleApiResponse(() => 
        apiClient.get(`/dashboard/sales-trend?days=${days}`)
      );
    },
    staleTime: 300000, // 5 minutes
    onError: (error) => {
      handleApiError(error, 'Sales Trend');
    },
  });
  
  useAutoLoader(query.isLoading, 'Loading sales trend...');
  return query;
};