/**
 * @file usePumps.ts
 * @description React Query hooks for pumps API
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pumpsService, Pump, CreatePumpRequest, UpdatePumpRequest } from '@/api/services/pumpsService';

/**
 * Hook to fetch all pumps or pumps for a specific station
 * @param stationId Optional station ID to filter by
 * @returns Query result with pumps data
 */
export const usePumps = (stationId?: string) => {
  return useQuery({
    queryKey: ['pumps', stationId ?? 'all'],
    queryFn: () => pumpsService.getPumps(stationId),
    staleTime: 60000, // 1 minute
  });
};

/**
 * Hook to fetch a pump by ID
 * @param id Pump ID
 * @returns Query result with pump data
 */
export const usePump = (id: string) => {
  return useQuery({
    queryKey: ['pump', id],
    queryFn: () => pumpsService.getPump(id),
    enabled: !!id,
    staleTime: 60000, // 1 minute
  });
};

/**
 * Hook to create a pump
 * @returns Mutation result for creating a pump
 */
export const useCreatePump = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreatePumpRequest) => pumpsService.createPump(data),
    onSuccess: (newPump) => {
      queryClient.invalidateQueries({ queryKey: ['pumps', newPump.stationId] });
      queryClient.invalidateQueries({ queryKey: ['pumps'] });
      queryClient.invalidateQueries({ queryKey: ['stations'] });
    },
  });
};

/**
 * Hook to update a pump
 * @returns Mutation result for updating a pump
 */
export const useUpdatePump = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePumpRequest }) => 
      pumpsService.updatePump(id, data),
    onSuccess: (updatedPump, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['pump', id] });
      queryClient.invalidateQueries({ queryKey: ['pumps'] });
      queryClient.invalidateQueries({ queryKey: ['pumps', updatedPump.stationId] });
    },
  });
};

/**
 * Hook to delete a pump
 * @returns Mutation result for deleting a pump
 */
export const useDeletePump = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => pumpsService.deletePump(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['pumps'] });
      queryClient.invalidateQueries({ queryKey: ['pump', id] });
      queryClient.invalidateQueries({ queryKey: ['stations'] });
    },
  });
};