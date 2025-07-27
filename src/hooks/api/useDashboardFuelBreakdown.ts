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
    staleTime: 300000, // 5 minutes
    onError: (error) => {
      handleApiError(error, 'Fuel Breakdown');
    },
  });
  
  useAutoLoader(query.isLoading, 'Loading fuel breakdown...');
  return query;
};