
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reconciliationApi } from '@/api/reconciliation';
import { CreateReconciliationRequest } from '@/api/api-contract';
import { useToast } from '@/hooks/use-toast';

export const useDailyReadingsSummary = (stationId: string, date: string) => {
  return useQuery({
    queryKey: ['reconciliation', 'daily-summary', stationId, date],
    queryFn: () => reconciliationApi.getDailyReadingsSummary(stationId, date),
    enabled: !!stationId && !!date,
  });
};

export const useCreateReconciliation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateReconciliationRequest) => reconciliationApi.createReconciliation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reconciliation'] });
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
  });
};
