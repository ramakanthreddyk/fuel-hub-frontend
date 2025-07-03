
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pumpsApi } from '@/api/pumps';

export const usePumps = (stationId?: string) => {
  return useQuery({
    queryKey: ['pumps', stationId],
    queryFn: () => pumpsApi.getPumps(stationId),
    enabled: !!stationId,
    staleTime: 0, // Always consider data stale
    gcTime: 1000, // Short cache time
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });
};

export const useCreatePump = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: pumpsApi.createPump,
    onSuccess: (pump) => {
      queryClient.invalidateQueries({ queryKey: ['pumps', pump.stationId] });
      queryClient.invalidateQueries({ queryKey: ['stations'] });
    },
  });
};

export const useUpdatePump = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => {
      // For now, we'll just log this since updatePump doesn't exist in pumpsApi
      console.log('Update pump not implemented:', { id, data });
      return Promise.resolve({ id, ...data, stationId: data.stationId });
    },
    onSuccess: (updatedPump: { id: string; stationId: string }) => {
      queryClient.invalidateQueries({ queryKey: ['pump', updatedPump.id] });
      queryClient.invalidateQueries({ queryKey: ['pumps', updatedPump.stationId] });
    },
  });
};

export const useDeletePump = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: pumpsApi.deletePump,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pumps'] });
      queryClient.invalidateQueries({ queryKey: ['stations'] });
    },
  });
};
