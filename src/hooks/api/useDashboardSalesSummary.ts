import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useToastNotifications } from '@/hooks/useToastNotifications';
import { useAutoLoader } from '@/hooks/useAutoLoader';
import { handleApiResponse } from '@/api/responseHandler';

interface SalesSummaryData {
  totalAmount: number;
  totalVolume: number;
  totalTransactions: number;
  period: string;
}

export const useDashboardSalesSummary = (period: 'daily' | 'weekly' | 'monthly' = 'monthly') => {
  const { handleApiError } = useToastNotifications();
  
  const query = useQuery({
    queryKey: ['dashboard-sales-summary', period],
    queryFn: async (): Promise<SalesSummaryData> => {
      return handleApiResponse(() => 
        apiClient.get(`/dashboard/sales-summary?period=${period}`)
      );
    },
    staleTime: 300000, // 5 minutes
    onError: (error) => {
      handleApiError(error, 'Sales Summary');
    },
  });
  
  useAutoLoader(query.isLoading, 'Loading sales summary...');
  return query;
};