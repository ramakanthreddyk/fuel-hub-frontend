
/**
 * @file useNozzles.ts
 * @description React Query hooks for nozzles API with toast notifications
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { nozzlesService } from '@/api/services/nozzlesService';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to fetch nozzles for a pump or all nozzles
 * @param pumpId Pump ID (optional - if not provided, fetches all nozzles)
 * @returns Query result with nozzles data
 */
export const useNozzles = (pumpId?: string) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['nozzles', pumpId || 'all'],
    queryFn: () => nozzlesService.getNozzles(pumpId),
    staleTime: 60000, // 1 minute
    retry: 2,
    meta: {
      onError: (error: any) => {
        console.error('Failed to fetch nozzles:', error);
        toast({
          title: "Error",
          description: "Failed to load nozzles. Please try again.",
          variant: "destructive",
        });
      }
    }
  });
};

/**
 * Hook to fetch a nozzle by ID
 * @param id Nozzle ID
 * @returns Query result with nozzle data
 */
export const useNozzle = (id: string) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['nozzle', id],
    queryFn: () => nozzlesService.getNozzle(id),
    enabled: !!id,
    staleTime: 60000, // 1 minute
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
  
  return useMutation({
    mutationFn: (data: any) => nozzlesService.createNozzle(data),
    onSuccess: (newNozzle, variables) => {
      queryClient.invalidateQueries({ queryKey: ['nozzles', variables.pumpId] });
      queryClient.invalidateQueries({ queryKey: ['nozzles', 'all'] });
      queryClient.invalidateQueries({ queryKey: ['pump', variables.pumpId] });
      toast({
        title: "Success",
        description: `Nozzle #${newNozzle.nozzleNumber} created successfully`,
      });
    },
    onError: (error: any) => {
      console.error('Failed to create nozzle:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create nozzle. Please try again.",
        variant: "destructive",
      });
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
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => nozzlesService.updateNozzle(id, data),
    onSuccess: (nozzle, { id }) => {
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
      console.error('Failed to update nozzle:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update nozzle. Please try again.",
        variant: "destructive",
      });
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
  
  return useMutation({
    mutationFn: (id: string) => nozzlesService.deleteNozzle(id),
    onSuccess: () => {
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
      console.error('Failed to delete nozzle:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete nozzle. Please try again.",
        variant: "destructive",
      });
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
  
  return useQuery({
    queryKey: ['nozzle-settings', id],
    queryFn: () => nozzlesService.getNozzleSettings(id),
    enabled: !!id,
    staleTime: 60000, // 1 minute
    meta: {
      onError: (error: any) => {
        console.error('Failed to fetch nozzle settings:', error);
        toast({
          title: "Error",
          description: "Failed to load nozzle settings. Please try again.",
          variant: "destructive",
        });
      }
    }
  });
};

/**
 * Hook to update nozzle settings
 * @returns Mutation result for updating nozzle settings
 */
export const useUpdateNozzleSettings = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
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
      console.error('Failed to update nozzle settings:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update nozzle settings. Please try again.",
        variant: "destructive",
      });
    },
  });
};
