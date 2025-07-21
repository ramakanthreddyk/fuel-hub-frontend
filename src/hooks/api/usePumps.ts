
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pumpsService } from '@/api/services/pumpsService';
import { toast } from '@/hooks/use-toast';
import { useDataStore } from '@/store/dataStore';
import { useErrorHandler } from '../useErrorHandler';

export const usePumps = (stationId?: string) => {
  const { pumps: storedPumps, setPumps } = useDataStore();
  const { handleError } = useErrorHandler();
  
  return useQuery({
    queryKey: ['pumps', stationId || 'all'],
    queryFn: async () => {
      // Check if we have cached data for this station
      if (stationId && storedPumps[stationId]) {
        console.log('[PUMPS-HOOK] Using cached pumps for station:', stationId);
        return storedPumps[stationId];
      }
      
      const pumps = await pumpsService.getPumps(stationId);
      
      // Store in cache if we have a stationId
      if (stationId) {
        setPumps(stationId, pumps);
      }
      
      return pumps;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    onError: (error) => {
      handleError(error, 'Failed to fetch pumps.');
    },
  });
};

export const usePump = (id: string) => {
  const { pumps: storedPumps } = useDataStore();
  
  return useQuery({
    queryKey: ['pump', id],
    queryFn: async () => {
      // Check if we have cached data in any station's pumps
      for (const stationId in storedPumps) {
        const cachedPump = storedPumps[stationId]?.find(p => p.id === id);
        if (cachedPump) {
          console.log('[PUMPS-HOOK] Using cached pump:', id);
          return cachedPump;
        }
      }
      
      return pumpsService.getPump(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreatePump = () => {
  const queryClient = useQueryClient();
  const { clearPumps } = useDataStore();
  const { handleError } = useErrorHandler();
  
  return useMutation({
    mutationFn: (data: any) => pumpsService.createPump(data),
    onSuccess: (newPump) => {
      // Clear cached pumps for this station to force a refresh
      clearPumps(newPump.stationId);
      queryClient.invalidateQueries({ queryKey: ['pumps', newPump.stationId] });
      queryClient.invalidateQueries({ queryKey: ['pumps', 'all'] });
      queryClient.invalidateQueries({ queryKey: ['station', newPump.stationId] });
      toast({
        title: "Success",
        description: `Pump "${newPump.name}" created successfully`,
      });
    },
    onError: (error: any) => {
      handleError(error, 'Failed to create pump.');
    },
  });
};

export const useUpdatePump = () => {
  const queryClient = useQueryClient();
  const { clearPumps } = useDataStore();
  const { handleError } = useErrorHandler();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => pumpsService.updatePump(id, data),
    onSuccess: (updatedPump, { id }) => {
      // Clear cached pumps for this station to force a refresh
      clearPumps(updatedPump.stationId);
      queryClient.invalidateQueries({ queryKey: ['pump', id] });
      queryClient.invalidateQueries({ queryKey: ['pumps'] });
      queryClient.invalidateQueries({ queryKey: ['station', updatedPump.stationId] });
      toast({
        title: "Success",
        description: `Pump "${updatedPump.name}" updated successfully`,
      });
    },
    onError: (error: any) => {
      handleError(error, 'Failed to update pump.');
    },
  });
};

export const useDeletePump = () => {
  const queryClient = useQueryClient();
  const { clearPumps } = useDataStore();
  const { handleError } = useErrorHandler();
  
  return useMutation({
    mutationFn: (id: string) => pumpsService.deletePump(id),
    onSuccess: () => {
      // Clear all cached pumps to force a refresh
      clearPumps();
      queryClient.invalidateQueries({ queryKey: ['pumps'] });
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      toast({
        title: "Success",
        description: "Pump deleted successfully",
      });
    },
    onError: (error: any) => {
      handleError(error, 'Failed to delete pump.');
    },
  });
};
