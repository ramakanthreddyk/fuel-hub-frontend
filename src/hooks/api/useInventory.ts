/**
 * @file hooks/api/useInventory.ts
 * @description React Query hooks for fuel inventory API
 */
import { useQuery } from '@tanstack/react-query';
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
    retry: 2,
    onError: (error) => {
      console.error('[INVENTORY-HOOK] Error fetching fuel inventory:', error);
    }
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
    retry: 2,
    onError: (error) => {
      console.error('[INVENTORY-HOOK] Error fetching inventory summary:', error);
    }
  });
};