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
 * @param stationId Optional station ID to filter by
 * @param startDate Optional start date to filter by
 * @param endDate Optional end date to filter by
 * @returns Query result with cash reports
 */
export const useCashReports = (stationId?: string, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['cash-reports', stationId, startDate, endDate],
    queryFn: () => attendantService.getCashReports(stationId, startDate, endDate),
    staleTime: 60000 // 1 minute
  });
};