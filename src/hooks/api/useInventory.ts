
/**
 * @file hooks/api/useInventory.ts
 * @description React Query hooks for fuel inventory API
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryService, FuelInventory, FuelInventorySummary } from '@/api/services/inventoryService';

/**
 * Hook to fetch fuel inventory
 * @param stationId Optional station ID to filter by
 * @returns Query result with fuel inventory data
 */
export const useInventory = (stationId?: string) => {
  return useQuery({
    queryKey: ['fuel-inventory', stationId],
    queryFn: () => inventoryService.getFuelInventory(stationId),
    staleTime: 60000, // 1 minute
    retry: 2
  });
};

/**
 * Hook to fetch fuel inventory summary
 * @returns Query result with inventory summary data
 */
export const useInventorySummary = () => {
  return useQuery({
    queryKey: ['inventory-summary'],
    queryFn: () => inventoryService.getInventorySummary(),
    staleTime: 60000, // 1 minute
    retry: 2
  });
};

/**
 * Hook to update inventory counts
 */
export const useUpdateInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inventoryService.updateInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-summary'] });
    }
  });
};
