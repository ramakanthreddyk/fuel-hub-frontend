/**
 * Contract Nozzles Hook
 * 
 * React Query hooks for nozzle management using contract-aligned services.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { nozzlesService } from '@/api/contract/nozzles.service';
import { toast } from '@/hooks/use-toast';
import type { CreateNozzleRequest } from '@/api/api-contract';

export const useContractNozzles = (pumpId?: string) => {
  return useQuery({
    queryKey: ['contract-nozzles', pumpId],
    queryFn: () => nozzlesService.getNozzles(pumpId),
    enabled: !!pumpId,
  });
};

export const useContractNozzle = (nozzleId: string) => {
  return useQuery({
    queryKey: ['contract-nozzle', nozzleId],
    queryFn: () => nozzlesService.getNozzle(nozzleId),
    enabled: !!nozzleId,
  });
};

export const useCreateContractNozzle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNozzleRequest) => nozzlesService.createNozzle(data),
    onSuccess: (newNozzle) => {
      // Invalidate nozzles for the pump
      queryClient.invalidateQueries({ queryKey: ['contract-nozzles', newNozzle.pumpId] });
      queryClient.invalidateQueries({ queryKey: ['contract-nozzles'] });
      // Also invalidate pumps to update nozzle counts
      queryClient.invalidateQueries({ queryKey: ['contract-pumps'] });
      
      toast({
        title: "Success",
        description: `Nozzle #${newNozzle.nozzleNumber} created successfully`,
      });
    },
    onError: (error: any) => {
      console.error('Failed to create nozzle:', error);
      toast({
        title: "Error", 
        description: error.message || "Failed to create nozzle",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateContractNozzle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ nozzleId, data }: { nozzleId: string; data: Partial<CreateNozzleRequest> }) => 
      nozzlesService.updateNozzle(nozzleId, data),
    onSuccess: (updatedNozzle) => {
      queryClient.invalidateQueries({ queryKey: ['contract-nozzles'] });
      queryClient.invalidateQueries({ queryKey: ['contract-nozzle', updatedNozzle.id] });
      
      toast({
        title: "Success",
        description: "Nozzle updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update nozzle",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteContractNozzle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (nozzleId: string) => nozzlesService.deleteNozzle(nozzleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract-nozzles'] });
      queryClient.invalidateQueries({ queryKey: ['contract-pumps'] });
      
      toast({
        title: "Success",
        description: "Nozzle deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete nozzle",
        variant: "destructive",
      });
    },
  });
};