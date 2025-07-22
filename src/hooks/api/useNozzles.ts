/**
 * @file useNozzles.ts
 * @description React Query hooks for nozzles API with toast notifications
 * Enhanced to work with fuelStore as single source of truth
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { nozzlesService } from '@/api/services/nozzlesService';
import { useToast } from '@/hooks/use-toast';
import { useDataStore } from '@/store/dataStore';
import { useFuelStore } from '@/store/fuelStore';
import { useErrorHandler } from '../useErrorHandler';

/**
 * Hook to fetch nozzles for a pump or all nozzles
 * @param pumpId Pump ID (optional - if not provided, fetches all nozzles)
 * @returns Query result with nozzles data
 */
export const useNozzles = (pumpId?: string) => {
  const { toast } = useToast();
  const { handleError } = useErrorHandler();
  
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
      console.log('[NOZZLES-HOOK] Fetching nozzles for:', pumpId || 'all pumps');
      
      // Check if we have non-stale cached data in fuelStore
      if (pumpId && fuelStoreNozzles[pumpId] && !nozzlesStale) {
        console.log('[NOZZLES-HOOK] Using fuelStore cached nozzles for pump:', pumpId);
        return fuelStoreNozzles[pumpId];
      }
      
      // For 'all' nozzles, check if we have them cached and not stale
      if (!pumpId && allNozzles.length > 0 && !nozzlesStale) {
        console.log('[NOZZLES-HOOK] Using fuelStore cached all nozzles');
        return allNozzles;
      }
      
      // Fallback to dataStore for backward compatibility
      if (pumpId && storedNozzles[pumpId]) {
        console.log('[NOZZLES-HOOK] Using dataStore cached nozzles for pump:', pumpId);
        return storedNozzles[pumpId];
      }
      
      // If no cache or stale, fetch from API
      const nozzles = await nozzlesService.getNozzles(pumpId);
      
      // Store in both caches
      if (pumpId) {
        setNozzles(pumpId, nozzles); // dataStore
        setFuelStoreNozzles(pumpId, nozzles); // fuelStore
      } else {
        setAllNozzles(nozzles); // Store all nozzles in fuelStore
      }
      
      return nozzles;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    onError: (error) => {
      handleError(error, 'Failed to fetch nozzles.');
    },
  });
};

/**
 * Hook to fetch a nozzle by ID
 * @param id Nozzle ID
 * @returns Query result with nozzle data
 */
export const useNozzle = (id: string) => {
  const { toast } = useToast();
  const { nozzles: storedNozzles } = useDataStore();
  const { nozzles: fuelStoreNozzles, allNozzles, nozzlesStale } = useFuelStore();
  
  return useQuery({
    queryKey: ['nozzle', id],
    queryFn: async () => {
      // First check fuelStore's allNozzles if not stale
      if (allNozzles.length > 0 && !nozzlesStale) {
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
      return nozzlesService.getNozzle(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error: any) => {
      console.error('Failed to fetch nozzle:', error);
      toast({
        title: "Error",
        description: "Failed to load nozzle details. Please try again.",
        variant: "destructive",
      });
    }
  });
};

/**
 * Hook to create a nozzle
 * @returns Mutation result for creating a nozzle
 */
export const useCreateNozzle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { clearNozzles } = useDataStore();
  const { invalidateNozzles } = useFuelStore();
  const { handleError } = useErrorHandler();
  
  return useMutation({
    mutationFn: (data: any) => nozzlesService.createNozzle(data),
    onSuccess: (newNozzle, variables) => {
      // Clear cached nozzles to force a refresh
      clearNozzles(variables.pumpId); // dataStore
      invalidateNozzles(variables.pumpId); // fuelStore
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['nozzles', variables.pumpId] });
      queryClient.invalidateQueries({ queryKey: ['nozzles', 'all'] });
      queryClient.invalidateQueries({ queryKey: ['pump', variables.pumpId] });
      
      toast({
        title: "Success",
        description: `Nozzle #${newNozzle.nozzleNumber} created successfully`,
      });
    },
    onError: (error: any) => {
      handleError(error, 'Failed to create nozzle.');
    },
  });
};

/**
 * Hook to update a nozzle
 * @returns Mutation result for updating a nozzle
 */
export const useUpdateNozzle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { clearNozzles } = useDataStore();
  const { invalidateNozzles } = useFuelStore();
  const { handleError } = useErrorHandler();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => nozzlesService.updateNozzle(id, data),
    onSuccess: (nozzle, { id }) => {
      // Clear cached nozzles for this pump to force a refresh
      if (nozzle && nozzle.pumpId) {
        clearNozzles(nozzle.pumpId); // dataStore
        invalidateNozzles(nozzle.pumpId); // fuelStore
      } else {
        // If we don't know the pump, invalidate all nozzles
        clearNozzles(); // dataStore
        invalidateNozzles(); // fuelStore
      }
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['nozzle', id] });
      queryClient.invalidateQueries({ queryKey: ['nozzles'] });
      queryClient.invalidateQueries({ queryKey: ['nozzles', 'all'] });
      
      // Also invalidate the pump that this nozzle belongs to
      if (nozzle && nozzle.pumpId) {
        queryClient.invalidateQueries({ queryKey: ['pump', nozzle.pumpId] });
        queryClient.invalidateQueries({ queryKey: ['nozzles', nozzle.pumpId] });
      }
      
      toast({
        title: "Success",
        description: `Nozzle #${nozzle.nozzleNumber} updated successfully`,
      });
    },
    onError: (error: any) => {
      handleError(error, 'Failed to update nozzle.');
    },
  });
};

/**
 * Hook to delete a nozzle
 * @returns Mutation result for deleting a nozzle
 */
export const useDeleteNozzle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { clearNozzles } = useDataStore();
  const { invalidateNozzles } = useFuelStore();
  const { handleError } = useErrorHandler();
  
  return useMutation({
    mutationFn: (id: string) => nozzlesService.deleteNozzle(id),
    onSuccess: () => {
      // Clear all cached nozzles to force a refresh
      clearNozzles(); // dataStore
      invalidateNozzles(); // fuelStore
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['nozzles'] });
      queryClient.invalidateQueries({ queryKey: ['nozzles', 'all'] });
      
      // We don't know which pump this nozzle belonged to, so we invalidate all pumps
      queryClient.invalidateQueries({ queryKey: ['pumps'] });
      
      toast({
        title: "Success",
        description: "Nozzle deleted successfully",
      });
    },
    onError: (error: any) => {
      handleError(error, 'Failed to delete nozzle.');
    },
  });
};

/**
 * Hook to fetch nozzle settings
 * @param id Nozzle ID
 * @returns Query result with nozzle settings
 */
export const useNozzleSettings = (id: string) => {
  const { toast } = useToast();
  const { handleError } = useErrorHandler();
  
  return useQuery({
    queryKey: ['nozzle-settings', id],
    queryFn: () => nozzlesService.getNozzleSettings(id),
    enabled: !!id,
    staleTime: 60000, // 1 minute
    onError: (error) => {
      handleError(error, 'Failed to fetch nozzle settings.');
    },
  });
};

/**
 * Hook to update nozzle settings
 * @returns Mutation result for updating nozzle settings
 */
export const useUpdateNozzleSettings = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { handleError } = useErrorHandler();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => nozzlesService.updateNozzleSettings(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['nozzle-settings', id] });
      toast({
        title: "Success",
        description: "Nozzle settings updated successfully",
      });
    },
    onError: (error: any) => {
      handleError(error, 'Failed to update nozzle settings.');
    },
  });
};
