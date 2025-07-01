
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pumpsApi, CreatePumpRequest } from '@/api/pumps';
import { useToast } from '@/hooks/use-toast';

export const usePumps = (stationId: string) => {
  return useQuery({
    queryKey: ['pumps', stationId],
    queryFn: () => pumpsApi.getPumps(stationId),
    enabled: !!stationId,
    retry: 1,
    staleTime: 60000,
  });
};

export const usePump = (pumpId: string) => {
  return useQuery({
    queryKey: ['pumps', pumpId],
    queryFn: () => pumpsApi.getPump(pumpId),
    enabled: !!pumpId,
  });
};

export const useCreatePump = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreatePumpRequest) => pumpsApi.createPump(data),
    onSuccess: (newPump) => {
      // Invalidate pumps for the station
      queryClient.invalidateQueries({ queryKey: ['pumps', newPump.stationId] });
      // Also invalidate stations to update pump counts
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      
      toast({
        title: "Success",
        description: `Pump "${newPump.label}" created successfully`,
      });
    },
    onError: (error: any) => {
      console.error('Failed to create pump:', error);
      toast({
        title: "Error", 
        description: error.response?.data?.message || "Failed to create pump",
        variant: "destructive",
      });
    },
  });
};

export const useDeletePump = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (pumpId: string) => pumpsApi.deletePump(pumpId),
    onSuccess: () => {
      // Invalidate all pump-related queries
      queryClient.invalidateQueries({ queryKey: ['pumps'] });
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      
      toast({
        title: "Success",
        description: "Pump deleted successfully",
      });
    },
    onError: (error: any) => {
      console.error('Failed to delete pump:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete pump", 
        variant: "destructive",
      });
    },
  });
};
