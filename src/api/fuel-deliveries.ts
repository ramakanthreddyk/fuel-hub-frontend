
import { apiClient, extractApiData, extractApiArray } from './client';
import type { FuelDelivery, ApiResponse } from './api-contract';
import type { CreateFuelDeliveryRequest } from './fuel-delivery-types';

export const fuelDeliveriesApi = {
  // Get all fuel deliveries
  getFuelDeliveries: async (stationId?: string): Promise<FuelDelivery[]> => {
    try {
      const params = new URLSearchParams();
      if (stationId) params.append('stationId', stationId);
      
      const response = await apiClient.get(`/fuel-deliveries?${params.toString()}`);
      return extractApiArray<FuelDelivery>(response, 'deliveries');
    } catch (error) {
      console.error('Error fetching fuel deliveries:', error);
      return [];
    }
  },

  // Create new fuel delivery
  createFuelDelivery: async (deliveryData: CreateFuelDeliveryRequest): Promise<FuelDelivery> => {
    const response = await apiClient.post('/fuel-deliveries', deliveryData);
    return extractApiData<FuelDelivery>(response);
  }
};

// Export types for backward compatibility
export type { FuelDelivery };
export { CreateFuelDeliveryRequest } from './fuel-delivery-types';
