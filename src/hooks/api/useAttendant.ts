import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendantApi, CreateCashReportRequest } from '@/api/attendant';
import { useToast } from '@/hooks/use-toast';

export const useAttendantStations = () => {
  const { toast } = useToast();
  return useQuery({
    queryKey: ['attendant', 'stations'],
    queryFn: attendantApi.getAssignedStations,
    staleTime: 5 * 60 * 1000,
    onError: (error: any) => {
      console.error('[ATTENDANT-API] Failed to fetch stations:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch stations. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

export const useAttendantPumps = (stationId?: string) => {
  const { toast } = useToast();
  return useQuery({
    queryKey: ['attendant', 'pumps', stationId],
    queryFn: () => attendantApi.getAssignedPumps(stationId),
    enabled: !!stationId,
    staleTime: 5 * 60 * 1000,
    onError: (error: any) => {
      console.error('[ATTENDANT-API] Failed to fetch pumps:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch pumps. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

export const useAttendantNozzles = (pumpId?: string) => {
  const { toast } = useToast();
  return useQuery({
    queryKey: ['attendant', 'nozzles', pumpId],
    queryFn: () => attendantApi.getAssignedNozzles(pumpId),
    enabled: !!pumpId,
    staleTime: 5 * 60 * 1000,
    onError: (error: any) => {
      console.error('[ATTENDANT-API] Failed to fetch nozzles:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch nozzles. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

// Fetch creditors with optional stationId
export const useAttendantCreditors = (stationId?: string) => {
  const { toast } = useToast();
  return useQuery({
    queryKey: ['attendant', 'creditors', stationId],
    queryFn: () => {
      // Make sure stationId is a string or undefined, not an object
      const safeStationId = stationId && typeof stationId === 'string' ? stationId : undefined;
      return attendantApi.getAssignedCreditors(safeStationId);
    },
    // Always fetch creditors, even without stationId
    staleTime: 10 * 60 * 1000,
    retry: 1,
    onError: (error: any) => {
      console.error('[ATTENDANT-API] Failed to fetch creditors:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch creditors. Using manual entry mode.',
        variant: 'destructive',
      });
    },
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
      console.error('[ATTENDANT-API] Failed to create cash report:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create cash report. Please try again.',
        variant: 'destructive',
      });
    },
    retry: 1, // Retry once on failure
  });
};

// Add the missing hook
export const useSubmitCashReport = () => {
  return useCreateCashReport();
};

export const useCashReports = (stationId?: string, dateFrom?: string, dateTo?: string) => {
  const { toast } = useToast();
  return useQuery({
    queryKey: ['attendant', 'cash-reports', stationId, dateFrom, dateTo],
    queryFn: () => attendantApi.getCashReports(stationId, dateFrom, dateTo),
    staleTime: 2 * 60 * 1000,
    onError: (error: any) => {
      console.error('[ATTENDANT-API] Failed to fetch cash reports:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch cash reports. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

export const useAttendantAlerts = (stationId?: string, unreadOnly?: boolean) => {
  const { toast } = useToast();
  return useQuery({
    queryKey: ['attendant', 'alerts', stationId, unreadOnly],
    queryFn: () => attendantApi.getAlerts(),
    refetchInterval: 60 * 1000,
    onError: (error: any) => {
      console.error('[ATTENDANT-API] Failed to fetch alerts:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch alerts. Please try again.',
        variant: 'destructive',
      });
    },
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
        title: "Success",
        description: "Alert has been marked as acknowledged",
        variant: "success",
      });
    },
    onError: (error: any) => {
      console.error('[ATTENDANT-API] Failed to acknowledge alert:', error);
      toast({
        title: 'Error',
        description: 'Failed to acknowledge alert. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

export const useInventory = () => {
  const { toast } = useToast();
  return useQuery({
    queryKey: ['attendant', 'inventory'],
    queryFn: () => attendantApi.getAssignedStations(), // Replace with actual inventory API call
    staleTime: 5 * 60 * 1000,
    onError: (error: any) => {
      console.error('[ATTENDANT-API] Failed to fetch inventory:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch inventory. Please try again.',
        variant: 'destructive',
      });
    },
  });
};