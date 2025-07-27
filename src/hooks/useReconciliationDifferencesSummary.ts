
import { useQuery } from '@tanstack/react-query';
import { useErrorHandler } from './useErrorHandler';

interface ReconciliationSummary {
  totalDifference: number;
  stationCount: number;
  resolved: number;
  pending: number;
}

export const useReconciliationDifferencesSummary = (stationId: string, date: string) => {
  const { handleError } = useErrorHandler();
  
  return useQuery({
    queryKey: ['reconciliation-differences', stationId, date],
    queryFn: async (): Promise<ReconciliationSummary> => {
      // Mock data for demonstration
      return {
        totalDifference: 5000,
        stationCount: 3,
        resolved: 2,
        pending: 1
      };
    },
    enabled: !!stationId && !!date,
    staleTime: 300000, // 5 minutes
    onError: (error) => {
      handleError(error, 'Failed to fetch reconciliation differences.');
    },
  });
};
