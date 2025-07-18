
/**
 * @file useNozzles.ts
 * @description React Query hooks for nozzles API with toast notifications
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { nozzlesService } from '@/api/services/nozzlesService';
import { useToast } from '@/hooks/use-toast';
import { useDataStore } from '@/store/dataStore';
import { useErrorHandler } from '../useErrorHandler';

/**
 * Hook to fetch nozzles for a pump or all nozzles
 * @param pumpId Pump ID (optional - if not provided, fetches all nozzles)
 * @returns Query result with nozzles data
 */
export const useNozzles = (pumpId?: string) => {
  const { toast } = useToast();
  const { nozzles: storedNozzles, setNozzles } = useDataStore();
  const { handleError } = useErrorHandler();
  
  return useQuery({
    queryKey: ['nozzles', pumpId || 'all'],
    queryFn: async () => {
      // Check if we have cached data for this pump
      if (pumpId && storedNozzles[pumpId]) {
        console.log('[NOZZLES-HOOK] Using cached nozzles for pump:', pumpId);
        return storedNozzles[pumpId];
      }
      
      const nozzles = await nozzlesService.getNozzles(pumpId);
      
      // Store in cache if we have a pumpId
      if (pumpId) {
        setNozzles(pumpId, nozzles);
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
  
  return useQuery({
    queryKey: ['nozzle', id],
    queryFn: async () => {
      // Check if we have cached data in any pump's nozzles
      for (const pumpId in storedNozzles) {
        const cachedNozzle = storedNozzles[pumpId]?.find(n => n.id === id);
        if (cachedNozzle) {
          console.log('[NOZZLES-HOOK] Using cached nozzle:', id);
          return cachedNozzle;
        }
      }
      
      return nozzlesService.getNozzle(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    meta: {
      onError: (error: any) => {
        console.error('Failed to fetch nozzle:', error);
        toast({
          title: "Error",
          description: "Failed to load nozzle details. Please try again.",
          variant: "destructive",
        });
      }
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
  const { handleError } = useErrorHandler();
  
  return useMutation({
    mutationFn: (data: any) => nozzlesService.createNozzle(data),
    onSuccess: (newNozzle, variables) => {
      // Clear cached nozzles for this pump to force a refresh
      clearNozzles(variables.pumpId);
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
  const { handleError } = useErrorHandler();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => nozzlesService.updateNozzle(id, data),
    onSuccess: (nozzle, { id }) => {
      // Clear cached nozzles for this pump to force a refresh
      if (nozzle && nozzle.pumpId) {
        clearNozzles(nozzle.pumpId);
      }
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
  const { handleError } = useErrorHandler();
  
  return useMutation({
    mutationFn: (id: string) => nozzlesService.deleteNozzle(id),
    onSuccess: () => {
      // Clear all cached nozzles to force a refresh
      clearNozzles();
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
