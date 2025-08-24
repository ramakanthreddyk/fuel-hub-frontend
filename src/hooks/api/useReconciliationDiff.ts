/**
 * @file hooks/api/useReconciliationDiff.ts
 * @description React Query hooks for reconciliation differences API
 */
import { useQuery } from '@tanstack/react-query';
import { reconciliationDiffService, ReconciliationDiffFilters } from '@/api/services/reconciliationDiffService';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to fetch reconciliation differences
 */
export const useReconciliationDiffs = (filters: ReconciliationDiffFilters = {}) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['reconciliation-diffs', filters],
    queryFn: () => reconciliationDiffService.getReconciliationDiffs(filters),
    staleTime: 60000, // 1 minute
    retry: 2,
    enabled: !!filters.stationId && (user?.role === 'owner' || user?.role === 'manager') // Only run the query if stationId is provided and user has access
  });
};

/**
 * Hook to fetch discrepancy summary for dashboard
 * @param stationId - Station ID
 * @param date - Date in YYYY-MM-DD format
 */
export const useDiscrepancySummary = (stationId: string, date: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['discrepancy-summary', stationId, date],
    queryFn: () => reconciliationDiffService.getDiscrepancySummary(stationId, date),
    staleTime: 300000, // 5 minutes
    retry: 2,
    enabled: !!stationId && !!date && (user?.role === 'owner' || user?.role === 'manager') // Only run the query if stationId and date are provided and user has access
  });
};

/**
 * Hook to fetch reconciliation difference by ID
 */
export const useReconciliationDiffById = (id: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['reconciliation-diff', id],
    queryFn: () => reconciliationDiffService.getReconciliationDiffById(id),
    enabled: !!id && (user?.role === 'owner' || user?.role === 'manager'),
    staleTime: 60000,
    retry: 2
  });
};