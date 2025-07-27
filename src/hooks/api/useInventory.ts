
/**
 * @file hooks/api/useInventory.ts
 * @description React Query hooks for fuel inventory API
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryService, FuelInventory, FuelInventorySummary } from '@/api/services/inventoryService';
import { useToastNotifications } from '@/hooks/useToastNotifications';

/**
 * Hook to fetch fuel inventory
 * @param stationId Optional station ID to filter by
 * @returns Query result with fuel inventory data
 */
export const useInventory = (stationId?: string) => {
  const { showLoader, hideLoader, handleApiError } = useToastNotifications();
  
  return useQuery({
    queryKey: ['fuel-inventory', stationId],
    queryFn: async () => {
      const data = await inventoryService.getFuelInventory(stationId);
      return data;
    },
    onSuccess: () => {
      showSuccess('Inventory Loaded', 'Fuel inventory data loaded successfully');
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    onError: (error: any) => {
      handleApiError(error, 'Inventory');
    }
  });
};

/**
 * Hook to fetch fuel inventory summary
 * @returns Query result with inventory summary data
 */
export const useInventorySummary = () => {
  const { showLoader, hideLoader, handleApiError } = useToastNotifications();
  
  return useQuery({
    queryKey: ['inventory-summary'],
    queryFn: async () => {
      const data = await inventoryService.getInventorySummary();
      return data;
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    onError: (error: any) => {
      handleApiError(error, 'Inventory Summary');
    }
  });
};

/**
 * Hook to update inventory counts
 */
export const useUpdateInventory = () => {
  const queryClient = useQueryClient();
  const { showSuccess, handleApiError } = useToastNotifications();
  
  return useMutation({
    mutationFn: inventoryService.updateInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-summary'] });
      showSuccess('Inventory Updated', 'Fuel inventory has been updated successfully');
    },
    onError: (error: any) => {
      handleApiError(error, 'Update Inventory');
    }
  });
};
