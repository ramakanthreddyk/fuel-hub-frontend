
/**
 * @file hooks/api/useAttendant.ts
 * @description React Query hooks for attendant-specific API endpoints
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendantApi } from '@/api/attendant';

/**
 * Hook to fetch assigned stations for current attendant
 * @returns Query result with assigned stations data
 */
export const useAttendantStations = () => {
  return useQuery({
    queryKey: ['attendant', 'stations'],
    queryFn: () => attendantApi.getAssignedStations(),
    staleTime: 60000, // 1 minute
    retry: 2
  });
};

/**
 * Hook to fetch assigned pumps for current attendant
 * @param stationId Optional station ID to filter pumps
 * @returns Query result with assigned pumps data
 */
export const useAttendantPumps = (stationId?: string) => {
  return useQuery({
    queryKey: ['attendant', 'pumps', stationId || 'all'],
    queryFn: () => attendantApi.getAssignedPumps(stationId),
    staleTime: 60000, // 1 minute
    retry: 2,
    enabled: true // Always enabled as attendants should see their pumps
  });
};

/**
 * Hook to fetch assigned nozzles for current attendant
 * @param pumpId Optional pump ID to filter nozzles
 * @returns Query result with assigned nozzles data
 */
export const useAttendantNozzles = (pumpId?: string) => {
  return useQuery({
    queryKey: ['attendant', 'nozzles', pumpId || 'all'],
    queryFn: () => attendantApi.getAssignedNozzles(pumpId),
    staleTime: 60000, // 1 minute
    retry: 2,
    enabled: true // Always enabled as attendants should see their nozzles
  });
};

/**
 * Hook to fetch assigned creditors for current attendant
 * @param stationId Optional station ID to filter creditors
 * @returns Query result with assigned creditors data
 */
export const useAttendantCreditors = (stationId?: string) => {
  return useQuery({
    queryKey: ['attendant', 'creditors', stationId || 'all'],
    queryFn: () => attendantApi.getAssignedCreditors(stationId),
    staleTime: 60000, // 1 minute
    retry: 2
  });
};

/**
 * Hook to create cash report
 * @returns Mutation result for creating cash report
 */
export const useCreateCashReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => attendantApi.createCashReport(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendant', 'cash-reports'] });
    },
  });
};

/**
 * Hook to fetch cash reports for attendant
 * @param stationId Optional station ID filter
 * @param dateFrom Optional start date filter
 * @param dateTo Optional end date filter
 * @returns Query result with cash reports data
 */
export const useAttendantCashReports = (stationId?: string, dateFrom?: string, dateTo?: string) => {
  return useQuery({
    queryKey: ['attendant', 'cash-reports', stationId, dateFrom, dateTo],
    queryFn: () => attendantApi.getCashReports(stationId, dateFrom, dateTo),
    staleTime: 60000, // 1 minute
    retry: 2
  });
};

/**
 * Hook to fetch system alerts for attendant
 * @returns Query result with alerts data
 */
export const useAttendantAlerts = () => {
  return useQuery({
    queryKey: ['attendant', 'alerts'],
    queryFn: () => attendantApi.getAlerts(),
    staleTime: 30000, // 30 seconds for alerts
    retry: 2
  });
};

/**
 * Hook to acknowledge alert
 * @returns Mutation result for acknowledging alert
 */
export const useAcknowledgeAlert = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (alertId: string) => attendantApi.acknowledgeAlert(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendant', 'alerts'] });
    },
  });
};
