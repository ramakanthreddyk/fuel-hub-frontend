import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useToastNotifications } from '@/hooks/useToastNotifications';
import { useAutoLoader } from '@/hooks/useAutoLoader';
import { handleApiResponse } from '@/api/responseHandler';
import { FuelBreakdownData } from '@/api/api-contract';

export const useDashboardFuelBreakdown = () => {
  const { handleApiError } = useToastNotifications();
  
  const query = useQuery({
    queryKey: ['dashboard-fuel-breakdown'],
    queryFn: async (): Promise<FuelBreakdownData[]> => {
      return handleApiResponse(() => 
        apiClient.get('/dashboard/fuel-breakdown')
      );
    },
    staleTime: 30000, // 30 seconds
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: 2,
    onError: (error) => {
      console.error('Fuel breakdown error:', error);
      handleApiError(error, 'Fuel Breakdown');
    },
  });
  
  useAutoLoader(query.isLoading, 'Loading fuel breakdown...');
  return query;
};