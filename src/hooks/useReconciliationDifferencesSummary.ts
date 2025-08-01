
/**
 * @file useReconciliationDifferencesSummary.ts
 * @description UPDATED to use improved reconciliation API
 */
import { useQuery } from '@tanstack/react-query';
import { useErrorHandler } from './useErrorHandler';
import { apiClient } from '@/api/client';

interface ReconciliationSummary {
  totalDifference: number;
  stationCount: number;
  resolved: number;
  pending: number;
}

export const useReconciliationDifferencesSummary = (stationId?: string, date?: string) => {
  const { handleError } = useErrorHandler();

  return useQuery({
    queryKey: ['reconciliation-differences', stationId, date],
    queryFn: async (): Promise<ReconciliationSummary> => {
      try {
        // Use improved reconciliation dashboard API with apiClient
        const response = await apiClient.get('/reconciliation/dashboard');
        const dashboard = response.data.data;

        // Transform dashboard data to match expected interface
        return {
          totalDifference: dashboard.summary.totalDifferences || 0,
          stationCount: dashboard.summary.totalStations || 0,
          resolved: dashboard.summary.reconciledToday || 0,
          pending: dashboard.summary.pendingReconciliation || 0
        };
      } catch (error) {
        console.error('Error fetching reconciliation summary:', error);
        handleError(error, 'Failed to fetch reconciliation differences.');
        // Fallback to default values
        return {
          totalDifference: 0,
          stationCount: 0,
          resolved: 0,
          pending: 0
        };
      }
    },
    staleTime: 300000, // 5 minutes
  });
};
