
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendantApi, CreateCashReportRequest } from '@/api/attendant';
import { useToast } from '@/hooks/use-toast';

export const useAttendantStations = () => {
  return useQuery({
    queryKey: ['attendant', 'stations'],
    queryFn: attendantApi.getAssignedStations,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAttendantPumps = (stationId?: string) => {
  return useQuery({
    queryKey: ['attendant', 'pumps', stationId],
    queryFn: () => attendantApi.getAssignedPumps(stationId),
    enabled: !!stationId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAttendantNozzles = (pumpId?: string) => {
  return useQuery({
    queryKey: ['attendant', 'nozzles', pumpId],
    queryFn: () => attendantApi.getAssignedNozzles(pumpId),
    enabled: !!pumpId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAttendantCreditors = (stationId?: string) => {
  return useQuery({
    queryKey: ['attendant', 'creditors', stationId],
    queryFn: () => attendantApi.getAssignedCreditors(stationId),
    enabled: !!stationId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateCashReport = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateCashReportRequest) => attendantApi.createCashReport(data),
    onSuccess: () => {
      // Invalidate multiple related queries
      queryClient.invalidateQueries({ queryKey: ['attendant', 'cash-reports'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }); // Refresh dashboard data
      queryClient.invalidateQueries({ queryKey: ['reports'] }); // Refresh reports data
      
      // Toast is handled in the component for better context
    },
    onError: (error: any) => {
      // Log detailed error for debugging
      console.error('Cash report submission error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Toast is handled in the component for better context
    },
    retry: 1, // Retry once on failure
  });
};

// Add the missing hook
export const useSubmitCashReport = () => {
  return useCreateCashReport();
};

export const useCashReports = (stationId?: string, dateFrom?: string, dateTo?: string) => {
  return useQuery({
    queryKey: ['attendant', 'cash-reports', stationId, dateFrom, dateTo],
    queryFn: () => attendantApi.getCashReports(stationId, dateFrom, dateTo),
    staleTime: 2 * 60 * 1000,
  });
};

export const useAttendantAlerts = (stationId?: string, unreadOnly?: boolean) => {
  return useQuery({
    queryKey: ['attendant', 'alerts', stationId, unreadOnly],
    queryFn: () => attendantApi.getAlerts(),
    refetchInterval: 60 * 1000,
  });
};

export const useAcknowledgeAlert = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (alertId: string) => attendantApi.acknowledgeAlert(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendant', 'alerts'] });
      toast({
        title: "Alert acknowledged",
        description: "Alert has been marked as acknowledged",
      });
    },
  });
};

export const useInventory = () => {
  return useQuery({
    queryKey: ['attendant', 'inventory'],
    queryFn: () => attendantApi.getAssignedStations(), // Replace with actual inventory API call
    staleTime: 5 * 60 * 1000,
  });
};
