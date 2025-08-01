import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useToastNotifications } from '@/hooks/useToastNotifications';
import { useAutoLoader } from '@/hooks/useAutoLoader';
import { handleApiResponse } from '@/api/responseHandler';
import { SalesTrendData } from '@/api/api-contract';

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
    onError: (error: any) => {
      // Only show error for actual errors, not empty data scenarios
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        handleApiError(error, 'Sales Trend');
      } else {
        console.log('[SALES-TREND] Non-critical error:', error?.response?.status);
        // Don't show error toast for empty data scenarios
      }
    },
  });
  
  useAutoLoader(query.isLoading, 'Loading sales trend...');
  return query;
};