/**
 * @file api/services/inventoryService.ts
 * @description Service for fuel inventory API endpoints
 */
import apiClient, { extractData, extractArray } from '../core/apiClient';
import API_CONFIG from '../core/config';

// Types
export interface FuelInventory {
  id: string;
  stationId: string;
  stationName?: string;
  fuelType: 'petrol' | 'diesel' | 'premium';
  currentStock: number;
  capacity: number;
  lowThreshold: number;
  lastUpdated: string;
  status: 'normal' | 'low' | 'critical';
}

export interface FuelInventorySummary {
  totalTanks: number;
  lowStockCount: number;
  averageFillPercentage: number;
  totalCapacity: number;
  totalCurrentStock: number;
}

/**
 * Service for fuel inventory API
 */
export const inventoryService = {
  /**
   * Get fuel inventory for all stations or a specific station
   * @param stationId Optional station ID to filter by
   * @returns List of fuel inventory items
   */
  getFuelInventory: async (stationId?: string): Promise<FuelInventory[]> => {
    try {
      console.log('[INVENTORY-API] Fetching fuel inventory', stationId ? `for station: ${stationId}` : '');
      
      const params = stationId ? { stationId } : {};
      const response = await apiClient.get('fuel-inventory', { params });
      
      // Extract inventory from response
      let inventoryArray: FuelInventory[] = [];
      
      if (response.data?.data?.inventory) {
        inventoryArray = response.data.data.inventory;
      } else if (response.data?.inventory) {
        inventoryArray = response.data.inventory;
      } else if (Array.isArray(response.data)) {
        inventoryArray = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        inventoryArray = response.data.data;
      } else {
        inventoryArray = extractArray<FuelInventory>(response, 'inventory');
      }
      
      console.log(`[INVENTORY-API] Successfully fetched ${inventoryArray.length} inventory items`);
      return inventoryArray;
    } catch (error) {
      console.error('[INVENTORY-API] Error fetching fuel inventory:', error);
      // Return empty array on error
      return [];
    }
  },
  
  /**
   * Get fuel inventory summary
   * @returns Fuel inventory summary
   */
  getInventorySummary: async (): Promise<FuelInventorySummary | null> => {
    try {
      console.log('[INVENTORY-API] Fetching inventory summary');
      const response = await apiClient.get('fuel-inventory/summary');
      return extractData<FuelInventorySummary>(response);
    } catch (error) {
      console.error('[INVENTORY-API] Error fetching inventory summary:', error);
      
      // Try to calculate summary from inventory data if API fails
      try {
        const inventory = await inventoryService.getFuelInventory();
        
        if (inventory.length === 0) {
          return null;
        }
        
        const totalTanks = inventory.length;
        const lowStockCount = inventory.filter(item => 
          item.status === 'critical' || item.status === 'low' || 
          item.currentStock <= item.lowThreshold
        ).length;
        
        const totalCapacity = inventory.reduce((sum, item) => sum + item.capacity, 0);
        const totalCurrentStock = inventory.reduce((sum, item) => sum + item.currentStock, 0);
        
        const averageFillPercentage = Math.round(
          (totalCurrentStock / totalCapacity) * 100
        );
        
        return {
          totalTanks,
          lowStockCount,
          averageFillPercentage,
          totalCapacity,
          totalCurrentStock
        };
      } catch (fallbackError) {
        console.error('[INVENTORY-API] Error calculating inventory summary:', fallbackError);
        return null;
      }
    }
  },

  /**
   * Update fuel inventory count for a station
   */
  updateInventory: async (data: {
    stationId: string;
    fuelType: string;
    newStock: number;
  }): Promise<boolean> => {
    try {
      console.log('[INVENTORY-API] Updating inventory', data);
      await apiClient.post('/inventory/update', data);
      return true;
    } catch (error) {
      console.error('[INVENTORY-API] Error updating inventory:', error);
      return false;
    }
  }
};

export default inventoryService;