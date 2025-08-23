
import { apiClient, extractApiData, extractApiArray } from './client';
import type { FuelPrice, CreateFuelPriceRequest, ApiResponse } from './api-contract';
import { secureLog, sanitizeUrlParam } from '@/utils/security';

export const fuelPricesApi = {
  // Get all fuel prices
  getFuelPrices: async (): Promise<FuelPrice[]> => {
    try {
      const response = await apiClient.get('/fuel-prices');
      return extractApiArray<FuelPrice>(response, 'prices');
    } catch (error) {
      secureLog.error('[FUEL-PRICES-API] Error fetching fuel prices:', error);
      return [];
    }
  },

  // Create new fuel price
  createFuelPrice: async (data: CreateFuelPriceRequest): Promise<FuelPrice> => {
    try {
      const response = await apiClient.post('/fuel-prices', data);
      return extractApiData<FuelPrice>(response);
    } catch (error) {
      secureLog.error('[FUEL-PRICES-API] Error creating fuel price:', error);
      throw error;
    }
  },

  // Update fuel price
  updateFuelPrice: async (id: string, data: object): Promise<FuelPrice> => {
    try {
      const response = await apiClient.put(`/fuel-prices/${sanitizeUrlParam(id)}`, data);
      return extractApiData<FuelPrice>(response);
    } catch (error) {
      secureLog.error('[FUEL-PRICES-API] Error updating fuel price:', error);
      throw error;
    }
  }
};

// Export types for backward compatibility
export type { FuelPrice, CreateFuelPriceRequest };
