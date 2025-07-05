
import { apiClient, extractApiArray } from './client';
import type { FuelInventory, FuelInventoryParams } from './api-contract';
import { z } from 'zod';

const fuelInventorySchema = z.object({
  id: z.string(),
  stationId: z.string(),
  stationName: z.string().optional(),
  fuelType: z.string(),
  currentStock: z.number(),
  currentVolume: z.number(),
  minimumLevel: z.number(),
  maximumLevel: z.number(),
  lastUpdated: z.string(),
  status: z.string(),
});

export const fuelInventoryApi = {
  // Get fuel inventory status with optional filtering
  getFuelInventory: async (params?: FuelInventoryParams): Promise<FuelInventory[]> => {
    try {
      const searchParams = new URLSearchParams();
      if (params?.stationId) searchParams.append('stationId', params.stationId);
      if (params?.fuelType) searchParams.append('fuelType', params.fuelType);
      
      const response = await apiClient.get(`/fuel-inventory?${searchParams.toString()}`);
      return extractApiArray(response, 'inventory', fuelInventorySchema) as FuelInventory[];
    } catch (error) {
      console.error('Error fetching fuel inventory:', error);
      return [];
    }
  }
};
