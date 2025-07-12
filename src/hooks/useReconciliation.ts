
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reconciliationApi } from '@/api/reconciliation';
import { CreateReconciliationRequest } from '@/api/api-contract';
import { useToast } from '@/hooks/use-toast';

export const useDailyReadingsSummary = (stationId: string, date: string) => {
  return useQuery({
    queryKey: ['reconciliation', 'daily-summary', stationId, date],
    queryFn: () => reconciliationApi.getDailyReadingsSummary(stationId, date),
    enabled: !!stationId && !!date,
    staleTime: 60000, // 1 minute
  });
};

export const useCreateReconciliation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateReconciliationRequest) => reconciliationApi.createReconciliation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reconciliation'] });
      queryClient.invalidateQueries({ queryKey: ['reconciliation-diffs'] });
      queryClient.invalidateQueries({ queryKey: ['discrepancy-summary'] });
      toast({
        title: "Success",
        description: "Daily reconciliation completed successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to complete reconciliation",
        variant: "destructive",
      });
    },
  });
};

export const useReconciliationHistory = (stationId?: string) => {
  return useQuery({
    queryKey: ['reconciliation', 'history', stationId],
    queryFn: () => reconciliationApi.getReconciliationHistory(stationId),
    staleTime: 60000,
  });
};

export const useApproveReconciliation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => reconciliationApi.approveReconciliation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reconciliation'] });
      toast({
        title: "Success",
        description: "Reconciliation approved successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to approve reconciliation",
        variant: "destructive",
      });
    },
  });
};

export const useReconciliationById = (id: string) => {
  return useQuery({
    queryKey: ['reconciliation', 'detail', id],
    queryFn: () => reconciliationApi.getReconciliationById(id),
    enabled: !!id,
    staleTime: 60000,
  });
};

export const useReconciliationByStationAndDate = (stationId: string, date: string) => {
  return useQuery({
    queryKey: ['reconciliation', 'station-date', stationId, date],
    queryFn: () => reconciliationApi.getReconciliationByStationAndDate(stationId, date),
    enabled: !!stationId && !!date,
    staleTime: 60000,
  });
};
