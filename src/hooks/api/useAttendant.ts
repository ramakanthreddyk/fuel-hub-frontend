/**
 * @file hooks/api/useAttendant.ts
 * @description React Query hooks for attendant API
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { attendantService, CashReport } from '@/api/services/attendantService';

/**
 * Hook to submit cash report
 * @returns Mutation for submitting cash report
 */
export const useSubmitCashReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (report: CashReport) => attendantService.submitCashReport(report),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash-reports'] });
    }
  });
};

/**
 * Hook to fetch cash reports
 * @returns Query result with cash reports
 */
export const useCashReports = () => {
  return useQuery({
    queryKey: ['cash-reports'],
    queryFn: () => attendantService.getCashReports(),
    staleTime: 60000, // 1 minute
    retry: false // Don't retry on error to avoid multiple 403 errors
  });
};
