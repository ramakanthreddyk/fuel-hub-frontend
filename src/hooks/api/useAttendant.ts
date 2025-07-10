/**
 * @file hooks/api/useAttendant.ts
 * @description React Query hooks for attendant-specific API endpoints
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendantService, CashReport } from '@/api/services/attendantService';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to fetch fuel inventory
 */
export const useFuelInventory = (stationId?: string) => {
  return useQuery({
    queryKey: ['fuel-inventory', stationId],
    queryFn: () => attendantService.getFuelInventory(stationId),
    staleTime: 60000, // 1 minute
  });
};

/**
 * Hook to fetch fuel inventory summary
 */
export const useFuelInventorySummary = () => {
  return useQuery({
    queryKey: ['fuel-inventory-summary'],
    queryFn: () => attendantService.getFuelInventorySummary(),
    staleTime: 60000, // 1 minute
  });
};

/**
 * Hook to fetch stations assigned to the attendant
 */
export const useAttendantStations = () => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['attendant', 'stations'],
    queryFn: () => attendantService.getStations(),
    staleTime: 60000, // 1 minute
    retry: 2,
    meta: {
      onError: (error: any) => {
        console.error('Failed to fetch assigned stations:', error);
        toast({
          title: "Error",
          description: "Failed to load your assigned stations. Please try again.",
          variant: "destructive",
        });
      }
    }
  });
};

/**
 * Hook to fetch pumps for a station
 */
export const useAttendantPumps = (stationId?: string) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['attendant', 'pumps', stationId],
    queryFn: () => attendantService.getPumps(stationId!),
    enabled: !!stationId,
    staleTime: 60000, // 1 minute
    meta: {
      onError: (error: any) => {
        console.error('Failed to fetch pumps:', error);
        toast({
          title: "Error",
          description: "Failed to load pumps. Please try again.",
          variant: "destructive",
        });
      }
    }
  });
};

/**
 * Hook to fetch nozzles for a pump
 */
export const useAttendantNozzles = (pumpId?: string) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['attendant', 'nozzles', pumpId],
    queryFn: () => attendantService.getNozzles(pumpId!),
    enabled: !!pumpId,
    staleTime: 60000, // 1 minute
    meta: {
      onError: (error: any) => {
        console.error('Failed to fetch nozzles:', error);
        toast({
          title: "Error",
          description: "Failed to load nozzles. Please try again.",
          variant: "destructive",
        });
      }
    }
  });
};

/**
 * Hook to fetch creditors
 */
export const useAttendantCreditors = () => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['attendant', 'creditors'],
    queryFn: () => attendantService.getCreditors(),
    staleTime: 60000, // 1 minute
    meta: {
      onError: (error: any) => {
        console.error('Failed to fetch creditors:', error);
        toast({
          title: "Error",
          description: "Failed to load creditors. Please try again.",
          variant: "destructive",
        });
      }
    }
  });
};

/**
 * Hook to submit a cash report
 */
export const useSubmitCashReport = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (report: CashReport) => attendantService.submitCashReport(report),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendant', 'cash-reports'] });
      toast({
        title: "Success",
        description: "Cash report submitted successfully",
      });
    },
    onError: (error: any) => {
      console.error('Failed to submit cash report:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit cash report. Please try again.",
        variant: "destructive",
      });
    },
  });
};

/**
 * Hook to fetch cash reports
 */
export const useAttendantCashReports = () => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['attendant', 'cash-reports'],
    queryFn: () => attendantService.getCashReports(),
    staleTime: 60000, // 1 minute
    meta: {
      onError: (error: any) => {
        console.error('Failed to fetch cash reports:', error);
        toast({
          title: "Error",
          description: "Failed to load cash reports. Please try again.",
          variant: "destructive",
        });
      }
    }
  });
};

/**
 * Hook to fetch alerts
 */
export const useAttendantAlerts = (stationId?: string, unreadOnly?: boolean) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['attendant', 'alerts', stationId, unreadOnly],
    queryFn: () => attendantService.getAlerts(stationId, unreadOnly),
    staleTime: 30000, // 30 seconds
    meta: {
      onError: (error: any) => {
        console.error('Failed to fetch alerts:', error);
        toast({
          title: "Error",
          description: "Failed to load alerts. Please try again.",
          variant: "destructive",
        });
      }
    }
  });
};

/**
 * Hook to acknowledge an alert
 */
export const useAcknowledgeAlert = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (alertId: string) => attendantService.acknowledgeAlert(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendant', 'alerts'] });
      toast({
        title: "Success",
        description: "Alert acknowledged",
      });
    },
    onError: (error: any) => {
      console.error('Failed to acknowledge alert:', error);
      toast({
        title: "Error",
        description: "Failed to acknowledge alert. Please try again.",
        variant: "destructive",
      });
    },
  });
};