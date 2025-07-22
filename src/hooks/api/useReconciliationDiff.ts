/**
 * @file hooks/api/useReconciliationDiff.ts
 * @description React Query hooks for reconciliation differences API
 */
import { useQuery } from '@tanstack/react-query';
import { reconciliationDiffService, ReconciliationDiffFilters } from '@/api/services/reconciliationDiffService';

/**
 * Hook to fetch reconciliation differences
 */
export const useReconciliationDiffs = (filters: ReconciliationDiffFilters = {}) => {
  return useQuery({
    queryKey: ['reconciliation-diffs', filters],
    queryFn: () => reconciliationDiffService.getReconciliationDiffs(filters),
    staleTime: 60000, // 1 minute
    retry: 2,
    enabled: !!filters.stationId // Only run the query if stationId is provided
  });
};

/**
 * Hook to fetch discrepancy summary for dashboard
 * @param stationId - Station ID
 * @param date - Date in YYYY-MM-DD format
 */
export const useDiscrepancySummary = (stationId: string, date: string) => {
  return useQuery({
    queryKey: ['discrepancy-summary', stationId, date],
    queryFn: () => reconciliationDiffService.getDiscrepancySummary(stationId, date),
    staleTime: 300000, // 5 minutes
    retry: 2,
    enabled: !!stationId && !!date // Only run the query if stationId and date are provided
  });
};

/**
 * Hook to fetch reconciliation difference by ID
 */
export const useReconciliationDiffById = (id: string) => {
  return useQuery({
    queryKey: ['reconciliation-diff', id],
    queryFn: () => reconciliationDiffService.getReconciliationDiffById(id),
    enabled: !!id,
    staleTime: 60000,
    retry: 2
  });
};