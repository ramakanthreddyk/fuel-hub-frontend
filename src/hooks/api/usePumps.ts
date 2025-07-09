
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pumpsService } from '@/api/services/pumpsService';
import { toast } from '@/hooks/use-toast';

export const usePumps = (stationId?: string) => {
  return useQuery({
    queryKey: ['pumps', stationId || 'all'],
    queryFn: () => pumpsService.getPumps(stationId),
    staleTime: 60000,
    retry: 2,
    onError: (error: any) => {
      console.error('Failed to fetch pumps:', error);
      toast({
        title: "Error",
        description: "Failed to load pumps. Please try again.",
        variant: "destructive",
      });
    }
  });
};

export const usePump = (id: string) => {
  return useQuery({
    queryKey: ['pump', id],
    queryFn: () => pumpsService.getPump(id),
    enabled: !!id,
    staleTime: 60000,
    onError: (error: any) => {
      console.error('Failed to fetch pump:', error);
      toast({
        title: "Error",
        description: "Failed to load pump details. Please try again.",
        variant: "destructive",
      });
    }
  });
};

export const useCreatePump = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => pumpsService.createPump(data),
    onSuccess: (newPump) => {
      queryClient.invalidateQueries({ queryKey: ['pumps', newPump.stationId] });
      queryClient.invalidateQueries({ queryKey: ['pumps', 'all'] });
      queryClient.invalidateQueries({ queryKey: ['station', newPump.stationId] });
      toast({
        title: "Success",
        description: `Pump "${newPump.name}" created successfully`,
      });
    },
    onError: (error: any) => {
      console.error('Failed to create pump:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create pump. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdatePump = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => pumpsService.updatePump(id, data),
    onSuccess: (updatedPump, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['pump', id] });
      queryClient.invalidateQueries({ queryKey: ['pumps'] });
      queryClient.invalidateQueries({ queryKey: ['station', updatedPump.stationId] });
      toast({
        title: "Success",
        description: `Pump "${updatedPump.name}" updated successfully`,
      });
    },
    onError: (error: any) => {
      console.error('Failed to update pump:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update pump. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useDeletePump = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => pumpsService.deletePump(id),
    onSuccess: () => {
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
        description: error.message || "Failed to delete pump. Please try again.",
        variant: "destructive",
      });
    },
  });
};
