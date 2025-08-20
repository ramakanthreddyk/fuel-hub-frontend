/**
 * @file useNozzles.ts
 * @description React Query hooks for nozzles API with toast notifications
 * Enhanced to work with fuelStore as single source of truth
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { nozzleService } from '@/services/nozzleService';
import { useToastNotifications } from '@/hooks/useToastNotifications';
import { useDataStore } from '@/store/dataStore';
import { useFuelStore } from '@/store/fuelStore';
import { useStoreSync } from '@/hooks/useStoreSync';

/**
 * Hook to fetch nozzles for a pump or all nozzles
 * @param pumpId Pump ID (optional - if not provided, fetches all nozzles)
 * @returns Query result with nozzles data
 */
export const useNozzles = (pumpId?: string) => {
  const { handleApiError, showLoader, hideLoader } = useToastNotifications();
  
  // Use both stores for backward compatibility during transition
  const { nozzles: storedNozzles, setNozzles } = useDataStore();
  const { 
    nozzles: fuelStoreNozzles, 
    allNozzles,
    nozzlesStale,
    setNozzles: setFuelStoreNozzles,
    setAllNozzles
  } = useFuelStore();
  
  return useQuery({
    queryKey: ['nozzles', pumpId || 'all'],
    queryFn: async () => {
      try {
        showLoader(`Loading nozzles${pumpId ? ' for pump' : ''}...`);
        console.log('[NOZZLES-HOOK] Fetching nozzles for:', pumpId || 'all pumps');
        
        // Check if we have non-stale cached data in fuelStore
        if (pumpId && fuelStoreNozzles[pumpId] && !nozzlesStale) {
          console.log('[NOZZLES-HOOK] Using fuelStore cached nozzles for pump:', pumpId);
          hideLoader();
          return fuelStoreNozzles[pumpId];
        }
        
        // For 'all' nozzles, check if we have them cached and not stale
        if (!pumpId && Array.isArray(allNozzles) && allNozzles.length > 0 && !nozzlesStale) {
          console.log('[NOZZLES-HOOK] Using fuelStore cached all nozzles');
          hideLoader();
          return allNozzles;
        }
        
        // Fallback to dataStore for backward compatibility
        if (pumpId && storedNozzles[pumpId]) {
          console.log('[NOZZLES-HOOK] Using dataStore cached nozzles for pump:', pumpId);
          hideLoader();
          return storedNozzles[pumpId];
        }
        
        // If no cache or stale, fetch from API
  const nozzles = await nozzleService.getNozzles(pumpId);

        console.log('[NOZZLES-HOOK] Fetched nozzles from API:', nozzles);

        // Ensure each nozzle has proper isolation - log their currentReading values
        nozzles.forEach(nozzle => {
          console.log(`[NOZZLES-HOOK] Nozzle ${nozzle.id} currentReading:`, nozzle.currentReading);
        });

        // Store in both caches
        if (pumpId) {
          setNozzles(pumpId, nozzles); // dataStore
          setFuelStoreNozzles(pumpId, nozzles); // fuelStore
          console.log('[NOZZLES-HOOK] Stored nozzles for pump in cache:', pumpId);
        } else {
          setAllNozzles(nozzles); // Store all nozzles in fuelStore
          console.log('[NOZZLES-HOOK] Stored all nozzles in cache');
        }
        
        hideLoader();
        return nozzles;
      } catch (error: any) {
        hideLoader();
        handleApiError(error, 'Nozzles');
        throw error;
      }
    },
    staleTime: 30 * 1000, // 30 seconds - shorter for better real-time updates
    retry: 2,
    refetchOnWindowFocus: true, // Refetch when window gains focus
    refetchOnMount: true, // Always refetch on mount

  });
};

/**
 * Hook to fetch a nozzle by ID
 * @param id Nozzle ID
 * @returns Query result with nozzle data
 */
export const useNozzle = (id: string) => {
  // Removed unused handleApiError assignment
  const { nozzles: storedNozzles } = useDataStore();
  const { nozzles: fuelStoreNozzles, allNozzles, nozzlesStale } = useFuelStore();
  
  return useQuery({
    queryKey: ['nozzle', id],
    queryFn: async () => {
      // First check fuelStore's allNozzles if not stale
      if (Array.isArray(allNozzles) && allNozzles.length > 0 && !nozzlesStale) {
        const cachedNozzle = allNozzles.find(n => n.id === id);
        if (cachedNozzle) {
          console.log('[NOZZLES-HOOK] Using fuelStore allNozzles cache for nozzle:', id);
          return cachedNozzle;
        }
      }
      
      // Then check fuelStore's pump-specific nozzles if not stale
      if (!nozzlesStale) {
        for (const pumpId in fuelStoreNozzles) {
          const cachedNozzle = fuelStoreNozzles[pumpId]?.find(n => n.id === id);
          if (cachedNozzle) {
            console.log('[NOZZLES-HOOK] Using fuelStore pump cache for nozzle:', id);
            return cachedNozzle;
          }
        }
      }
      
      // Fallback to dataStore for backward compatibility
      for (const pumpId in storedNozzles) {
        const cachedNozzle = storedNozzles[pumpId]?.find(n => n.id === id);
        if (cachedNozzle) {
          console.log('[NOZZLES-HOOK] Using dataStore cache for nozzle:', id);
          return cachedNozzle;
        }
      }
      
      // If no cache hit, fetch from API
      console.log('[NOZZLES-HOOK] Fetching nozzle from API:', id);
  return nozzleService.getNozzle(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  // Error handling should be done in the queryFn or via useQuery's error result
  });
};

/**
 * Hook to create a nozzle
 * @returns Mutation result for creating a nozzle
 */
export const useCreateNozzle = () => {
  const { handleApiError, showSuccess } = useToastNotifications();
  const { syncAfterNozzleCRUD } = useStoreSync();
  return useMutation({
    mutationFn: (data: any) => {
      console.log('[CREATE-NOZZLE] Creating nozzle with data:', data);
      return nozzleService.createNozzle(data);
    },
    onSuccess: async (newNozzle, variables) => {
  // Use correct property names based on contract (nozzleNumber removed, use name and id)
      showSuccess('Nozzle Created', `Nozzle #${newNozzle.id} created successfully.`);
      const decimals = 3;
      const nozzleWithPumpId = {
        ...newNozzle,
        pumpId: newNozzle.pumpId || variables.pumpId,
        currentReading: typeof newNozzle.currentReading === 'number' ? Number(newNozzle.currentReading.toFixed(decimals)) : undefined,
      };
      console.log('[CREATE-NOZZLE] Triggering sync with nozzle data:', nozzleWithPumpId);
      await syncAfterNozzleCRUD('create', nozzleWithPumpId);
    },
    onError: (error: any) => {
      console.error('[CREATE-NOZZLE] Error creating nozzle:', error);
      handleApiError(error, 'Create Nozzle');
    },
  });
};

/**
 * Hook to update a nozzle
 * @returns Mutation result for updating a nozzle
 */
export const useUpdateNozzle = () => {
  // Removed unused handleApiError assignment
  const { syncAfterNozzleCRUD } = useStoreSync();

  return useMutation({
  mutationFn: ({ id, data }: { id: string; data: any }) => nozzleService.updateNozzle(id, data),
    onSuccess: async (nozzle, { id }) => {
      console.log('[UPDATE-NOZZLE] Success:', nozzle);
      await syncAfterNozzleCRUD('update', nozzle);
    },
    onError: (error: any) => {
      console.error('[UPDATE-NOZZLE] Error:', error);
  // Error handling: log or show toast if needed
    },
  });
};

/**
 * Hook to delete a nozzle
 * @returns Mutation result for deleting a nozzle
 */
export const useDeleteNozzle = () => {
  // Removed unused handleApiError assignment
  const { syncAfterNozzleCRUD } = useStoreSync();

  return useMutation({
  mutationFn: (id: string) => nozzleService.deleteNozzle(id),
    onSuccess: async (data, id) => {
      console.log('[DELETE-NOZZLE] Success:', id);
      await syncAfterNozzleCRUD('delete', { id });
    },
    onError: (error: any) => {
      console.error('[DELETE-NOZZLE] Error:', error);
  // Error handling: log or show toast if needed
    },
  });
};

/**
 * Hook to fetch nozzle settings
 * @param id Nozzle ID
 * @returns Query result with nozzle settings
 */
export const useNozzleSettings = (id: string) => {
  // Removed unused handleApiError assignment
  
  return useQuery({
    queryKey: ['nozzle-settings', id],
  queryFn: () => nozzleService.getNozzleSettings(id),
    enabled: !!id,
    staleTime: 60000, // 1 minute
  // Error handling should be done in the queryFn or via useQuery's error result
  });
};

/**
 * Hook to update nozzle settings
 * @returns Mutation result for updating nozzle settings
 */
export const useUpdateNozzleSettings = () => {
  const queryClient = useQueryClient();
  const { showSuccess, handleApiError } = useToastNotifications();
  
  return useMutation({
  mutationFn: ({ id, data }: { id: string; data: any }) => nozzleService.updateNozzleSettings(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['nozzle-settings', id] });
      showSuccess('Settings Updated', 'Nozzle settings updated successfully');
    },
    onError: (error: any) => {
      handleApiError(error, 'Update Nozzle Settings');
    },
  });
};
