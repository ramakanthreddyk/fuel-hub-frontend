
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendantApi, CreateCashReportRequest } from '@/api/attendant';
import { useToast } from '@/hooks/use-toast';

export const useAttendantStations = () => {
  return useQuery({
    queryKey: ['attendant', 'stations'],
    queryFn: attendantApi.getAssignedStations,
    staleTime: 5 * 60 * 1000, // 5 minutes - stations don't change often for attendants
  });
};

export const useAttendantPumps = (stationId?: string) => {
  return useQuery({
    queryKey: ['attendant', 'pumps', stationId],
    queryFn: () => attendantApi.getAssignedPumps(stationId),
    enabled: !!stationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAttendantNozzles = (pumpId?: string) => {
  return useQuery({
    queryKey: ['attendant', 'nozzles', pumpId],
    queryFn: () => attendantApi.getAssignedNozzles(pumpId),
    enabled: !!pumpId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAttendantCreditors = (stationId?: string) => {
  return useQuery({
    queryKey: ['attendant', 'creditors', stationId],
    queryFn: () => attendantApi.getAssignedCreditors(stationId),
    enabled: !!stationId,
    staleTime: 10 * 60 * 1000, // 10 minutes - creditors don't change often
  });
};

export const useCreateCashReport = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateCashReportRequest) => attendantApi.createCashReport(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendant', 'cash-reports'] });
      toast({
        title: "Success",
        description: "Cash report submitted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to submit cash report",
        variant: "destructive",
      });
    },
  });
};

export const useCashReports = (stationId?: string, dateFrom?: string, dateTo?: string) => {
  return useQuery({
    queryKey: ['attendant', 'cash-reports', stationId, dateFrom, dateTo],
    queryFn: () => attendantApi.getCashReports(stationId, dateFrom, dateTo),
    staleTime: 2 * 60 * 1000, // 2 minutes - cash reports change more frequently
  });
};

export const useAttendantAlerts = () => {
  return useQuery({
    queryKey: ['attendant', 'alerts'],
    queryFn: attendantApi.getAlerts,
    refetchInterval: 60 * 1000, // Check for new alerts every minute
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
