
import { apiClient, extractApiData, extractApiArray } from './client';
import type { ApiResponse } from './api-contract';
import type { FuelDelivery, CreateFuelDeliveryRequest } from './fuel-delivery-types';
import { secureLog, sanitizeUrlParam } from '@/utils/security';

export const fuelDeliveriesApi = {
  // Get all fuel deliveries
  getFuelDeliveries: async (stationId?: string): Promise<FuelDelivery[]> => {
    try {
      const params = new URLSearchParams();
      if (stationId) params.append('stationId', sanitizeUrlParam(stationId));
      
      const response = await apiClient.get(`/fuel-deliveries?${params.toString()}`);
      return extractApiArray<FuelDelivery>(response, 'deliveries');
    } catch (error) {
      secureLog.error('Error fetching fuel deliveries:', error);
      return [];
    }
  },

  // Create new fuel delivery
  createFuelDelivery: async (deliveryData: CreateFuelDeliveryRequest): Promise<FuelDelivery> => {
    try {
      const response = await apiClient.post('/fuel-deliveries', deliveryData);
      return extractApiData<FuelDelivery>(response);
    } catch (error) {
      secureLog.error('Error creating fuel delivery:', error);
      throw error;
    }
  }
};

// Export types for backward compatibility
export type { FuelDelivery, CreateFuelDeliveryRequest } from './fuel-delivery-types';
