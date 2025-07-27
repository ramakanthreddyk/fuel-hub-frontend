import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useToastNotifications } from '@/hooks/useToastNotifications';
import { useAutoLoader } from '@/hooks/useAutoLoader';
import { handleApiResponse } from '@/api/responseHandler';

interface StationPerformanceData {
  stationId: string;
  stationName: string;
  currentPeriodSales: number;
  previousPeriodSales: number;
  growthPercentage: number;
  totalVolume: number;
  averageTicketSize: number;
}

export const useStationPerformance = (stationId: string, range: 'daily' | 'weekly' | 'monthly' = 'monthly') => {
  const { handleApiError } = useToastNotifications();
  
  const query = useQuery({
    queryKey: ['station-performance', stationId, range],
    queryFn: async (): Promise<StationPerformanceData> => {
      return handleApiResponse(() => 
        apiClient.get(`/stations/${stationId}/performance?range=${range}`)
      );
    },
    staleTime: 300000, // 5 minutes
    enabled: !!stationId,
    onError: (error) => {
      handleApiError(error, 'Station Performance');
    },
  });
  
  useAutoLoader(query.isLoading, 'Loading station performance...');
  return query;
};