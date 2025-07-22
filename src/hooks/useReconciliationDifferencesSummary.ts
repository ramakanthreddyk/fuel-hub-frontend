import { useQuery } from '@tanstack/react-query';
import { reconciliationDiffService } from '@/api/services/reconciliationDiffService';

// Hook to get reconciliation differences summary
export const useReconciliationDifferencesSummary = (stationId: string, date: string) => {
  return useQuery({
    queryKey: ['reconciliation', 'differences-summary', stationId, date],
    queryFn: async () => {
      return await reconciliationDiffService.getDiscrepancySummary(stationId, date);
    },
    staleTime: 60000,
    enabled: !!stationId && !!date, // Only run the query if stationId and date are provided
  });
};
