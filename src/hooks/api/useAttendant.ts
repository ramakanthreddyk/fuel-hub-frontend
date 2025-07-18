
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendantApi, CreateCashReportRequest } from '@/api/attendant';
import { useToast } from '@/hooks/use-toast';
import { useErrorHandler } from '../useErrorHandler';

export const useAttendantStations = () => {
  const { handleError } = useErrorHandler();
  return useQuery({
    queryKey: ['attendant', 'stations'],
    queryFn: attendantApi.getAssignedStations,
    staleTime: 5 * 60 * 1000,
    onError: (error) => {
      handleError(error, 'Failed to fetch stations.');
    },
  });
};

export const useAttendantPumps = (stationId?: string) => {
  const { handleError } = useErrorHandler();
  return useQuery({
    queryKey: ['attendant', 'pumps', stationId],
    queryFn: () => attendantApi.getAssignedPumps(stationId),
    enabled: !!stationId,
    staleTime: 5 * 60 * 1000,
    onError: (error) => {
      handleError(error, 'Failed to fetch pumps.');
    },
  });
};

export const useAttendantNozzles = (pumpId?: string) => {
  const { handleError } = useErrorHandler();
  return useQuery({
    queryKey: ['attendant', 'nozzles', pumpId],
    queryFn: () => attendantApi.getAssignedNozzles(pumpId),
    enabled: !!pumpId,
    staleTime: 5 * 60 * 1000,
    onError: (error) => {
      handleError(error, 'Failed to fetch nozzles.');
    },
  });
};

export const useAttendantCreditors = (stationId?: string) => {
  const { handleError } = useErrorHandler();
  return useQuery({
    queryKey: ['attendant', 'creditors', stationId],
    queryFn: () => attendantApi.getAssignedCreditors(stationId),
    enabled: !!stationId,
    staleTime: 10 * 60 * 1000,
    onError: (error) => {
      handleError(error, 'Failed to fetch creditors.');
    },
  });
};

export const useCreateCashReport = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { handleError } = useErrorHandler();

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
      handleError(error, 'Failed to create cash report.');
    },
    retry: 1, // Retry once on failure
  });
};

// Add the missing hook
export const useSubmitCashReport = () => {
  return useCreateCashReport();
};

export const useCashReports = (stationId?: string, dateFrom?: string, dateTo?: string) => {
  const { handleError } = useErrorHandler();
  return useQuery({
    queryKey: ['attendant', 'cash-reports', stationId, dateFrom, dateTo],
    queryFn: () => attendantApi.getCashReports(stationId, dateFrom, dateTo),
    staleTime: 2 * 60 * 1000,
    onError: (error) => {
      handleError(error, 'Failed to fetch cash reports.');
    },
  });
};

export const useAttendantAlerts = (stationId?: string, unreadOnly?: boolean) => {
  const { handleError } = useErrorHandler();
  return useQuery({
    queryKey: ['attendant', 'alerts', stationId, unreadOnly],
    queryFn: () => attendantApi.getAlerts(),
    refetchInterval: 60 * 1000,
    onError: (error) => {
      handleError(error, 'Failed to fetch alerts.');
    },
  });
};

export const useAcknowledgeAlert = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { handleError } = useErrorHandler();

  return useMutation({
    mutationFn: (alertId: string) => attendantApi.acknowledgeAlert(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendant', 'alerts'] });
      toast({
        title: "Alert acknowledged",
        description: "Alert has been marked as acknowledged",
      });
    },
    onError: (error) => {
      handleError(error, 'Failed to acknowledge alert.');
    },
  });
};

export const useInventory = () => {
  const { handleError } = useErrorHandler();
  return useQuery({
    queryKey: ['attendant', 'inventory'],
    queryFn: () => attendantApi.getAssignedStations(), // Replace with actual inventory API call
    staleTime: 5 * 60 * 1000,
    onError: (error) => {
      handleError(error, 'Failed to fetch inventory.');
    },
  });
};
