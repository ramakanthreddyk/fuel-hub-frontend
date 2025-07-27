
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pumpsService } from '@/api/services/pumpsService';
import { useToastNotifications } from '@/hooks/useToastNotifications';
import { useDataStore } from '@/store/dataStore';

export const usePumps = (stationId?: string) => {
  const { pumps: storedPumps, setPumps } = useDataStore();
  const { handleApiError, showLoader, hideLoader } = useToastNotifications();
  
  return useQuery({
    queryKey: ['pumps', stationId || 'all'],
    queryFn: async () => {
      try {
        showLoader('Loading pumps...');
        
        // Check if we have cached data for this station
        if (stationId && storedPumps[stationId]) {
          console.log('[PUMPS-HOOK] Using cached pumps for station:', stationId);
          hideLoader();
          return storedPumps[stationId];
        }
        
        const pumps = await pumpsService.getPumps(stationId);
        
        // Store in cache if we have a stationId
        if (stationId) {
          setPumps(stationId, pumps);
        }
        
        hideLoader();
        return pumps;
      } catch (error: any) {
        hideLoader();
        handleApiError(error, 'Pumps');
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const usePump = (id: string) => {
  const { pumps: storedPumps } = useDataStore();
  const { handleApiError, showLoader, hideLoader } = useToastNotifications();
  
  return useQuery({
    queryKey: ['pump', id],
    queryFn: async () => {
      try {
        showLoader('Loading pump details...');
        
        // Check if we have cached data in any station's pumps
        for (const stationId in storedPumps) {
          const cachedPump = storedPumps[stationId]?.find(p => p.id === id);
          if (cachedPump) {
            console.log('[PUMPS-HOOK] Using cached pump:', id);
            hideLoader();
            return cachedPump;
          }
        }
        
        const pump = await pumpsService.getPump(id);
        hideLoader();
        return pump;
      } catch (error: any) {
        hideLoader();
        handleApiError(error, 'Pump Details');
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreatePump = () => {
  const queryClient = useQueryClient();
  const { clearPumps } = useDataStore();
  const { showSuccess, handleApiError } = useToastNotifications();
  
  return useMutation({
    mutationFn: (data: any) => pumpsService.createPump(data),
    onSuccess: (newPump) => {
      // Clear cached pumps for this station to force a refresh
      clearPumps(newPump.stationId);
      queryClient.invalidateQueries({ queryKey: ['pumps', newPump.stationId] });
      queryClient.invalidateQueries({ queryKey: ['pumps', 'all'] });
      queryClient.invalidateQueries({ queryKey: ['station', newPump.stationId] });
      showSuccess('Pump Created', `Pump "${newPump.name}" created successfully`);
    },
    onError: (error: any) => {
      handleApiError(error, 'Create Pump');
    },
  });
};

export const useUpdatePump = () => {
  const queryClient = useQueryClient();
  const { clearPumps } = useDataStore();
  const { showSuccess, handleApiError } = useToastNotifications();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => pumpsService.updatePump(id, data),
    onSuccess: (updatedPump, { id }) => {
      // Clear cached pumps for this station to force a refresh
      clearPumps(updatedPump.stationId);
      queryClient.invalidateQueries({ queryKey: ['pump', id] });
      queryClient.invalidateQueries({ queryKey: ['pumps'] });
      queryClient.invalidateQueries({ queryKey: ['station', updatedPump.stationId] });
      showSuccess('Pump Updated', `Pump "${updatedPump.name}" updated successfully`);
    },
    onError: (error: any) => {
      handleApiError(error, 'Update Pump');
    },
  });
};

export const useDeletePump = () => {
  const queryClient = useQueryClient();
  const { clearPumps } = useDataStore();
  const { showSuccess, handleApiError } = useToastNotifications();
  
  return useMutation({
    mutationFn: (id: string) => pumpsService.deletePump(id),
    onSuccess: () => {
      // Clear all cached pumps to force a refresh
      clearPumps();
      queryClient.invalidateQueries({ queryKey: ['pumps'] });
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      showSuccess('Pump Deleted', 'Pump deleted successfully');
    },
    onError: (error: any) => {
      handleApiError(error, 'Delete Pump');
    },
  });
};
