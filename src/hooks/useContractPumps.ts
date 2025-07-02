/**
 * Contract Pumps Hook
 * 
 * React Query hooks for pump management using contract-aligned services.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pumpsService } from '@/api/contract/pumps.service';
import { toast } from '@/hooks/use-toast';
import type { CreatePumpRequest } from '@/api/api-contract';

export const useContractPumps = (stationId?: string) => {
  return useQuery({
    queryKey: ['contract-pumps', stationId],
    queryFn: () => pumpsService.getPumps(stationId),
    enabled: true,
  });
};

export const useContractPump = (pumpId: string) => {
  return useQuery({
    queryKey: ['contract-pump', pumpId],
    queryFn: () => pumpsService.getPump(pumpId),
    enabled: !!pumpId,
  });
};

export const useCreateContractPump = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePumpRequest) => pumpsService.createPump(data),
    onSuccess: (newPump) => {
      // Invalidate pumps for the station
      queryClient.invalidateQueries({ queryKey: ['contract-pumps', newPump.stationId] });
      queryClient.invalidateQueries({ queryKey: ['contract-pumps'] });
      // Also invalidate stations to update pump counts
      queryClient.invalidateQueries({ queryKey: ['contract-stations'] });
      
      toast({
        title: "Success",
        description: `Pump "${newPump.name}" created successfully`,
      });
    },
    onError: (error: any) => {
      console.error('Failed to create pump:', error);
      toast({
        title: "Error", 
        description: error.message || "Failed to create pump",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateContractPump = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pumpId, data }: { pumpId: string; data: Partial<CreatePumpRequest> }) => 
      pumpsService.updatePump(pumpId, data),
    onSuccess: (updatedPump) => {
      queryClient.invalidateQueries({ queryKey: ['contract-pumps'] });
      queryClient.invalidateQueries({ queryKey: ['contract-pump', updatedPump.id] });
      
      toast({
        title: "Success",
        description: "Pump updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update pump",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteContractPump = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pumpId: string) => pumpsService.deletePump(pumpId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract-pumps'] });
      queryClient.invalidateQueries({ queryKey: ['contract-stations'] });
      
      toast({
        title: "Success",
        description: "Pump deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete pump",
        variant: "destructive",
      });
    },
  });
};