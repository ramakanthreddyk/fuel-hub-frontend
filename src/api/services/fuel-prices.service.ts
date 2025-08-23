/**
 * @file api/services/fuel-prices.service.ts
 * @description Service for fuel prices API endpoints
 */
import apiClient, { extractData, extractArray } from '../core/apiClient';
import { secureLog, sanitizeUrlParam } from '@/utils/security';

export interface FuelPrice {
  id: string;
  stationId: string;
  fuelType: string;
  price: number;
  validFrom: string;
  validTo?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FuelPriceFilters {
  stationId?: string;
  fuelType?: string;
  isActive?: boolean;
  validFrom?: string;
  validTo?: string;
}

export const fuelPricesService = {
  /**
   * Get fuel prices
   */
  getFuelPrices: async (filters: FuelPriceFilters = {}): Promise<FuelPrice[]> => {
    try {
      const params = new URLSearchParams();
      if (filters.stationId) params.append('stationId', sanitizeUrlParam(filters.stationId));
      if (filters.fuelType) params.append('fuelType', filters.fuelType);
      if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
      if (filters.validFrom) params.append('validFrom', filters.validFrom);
      if (filters.validTo) params.append('validTo', filters.validTo);

      const response = await apiClient.get(`/fuel-prices?${params.toString()}`);
      return extractArray<FuelPrice>(response, 'fuelPrices');
    } catch (error) {
      secureLog.error('[FUEL-PRICES-API] Error fetching fuel prices:', error);
      return [];
    }
  },

  /**
   * Get fuel price by ID
   */
  getFuelPrice: async (id: string): Promise<FuelPrice | null> => {
    try {
      const response = await apiClient.get(`/fuel-prices/${sanitizeUrlParam(id)}`);
      return extractData<FuelPrice>(response);
    } catch (error) {
      secureLog.error('[FUEL-PRICES-API] Error fetching fuel price:', error);
      return null;
    }
  },

  /**
   * Create fuel price
   */
  createFuelPrice: async (data: Partial<FuelPrice>): Promise<FuelPrice> => {
    try {
      const response = await apiClient.post('/fuel-prices', data);
      return extractData<FuelPrice>(response);
    } catch (error) {
      secureLog.error('[FUEL-PRICES-API] Error creating fuel price:', error);
      throw error;
    }
  },

  /**
   * Update fuel price
   */
  updateFuelPrice: async (id: string, data: Partial<FuelPrice>): Promise<FuelPrice> => {
    try {
      const response = await apiClient.put(`/fuel-prices/${sanitizeUrlParam(id)}`, data);
      return extractData<FuelPrice>(response);
    } catch (error) {
      secureLog.error('[FUEL-PRICES-API] Error updating fuel price:', error);
      throw error;
    }
  },

  /**
   * Delete fuel price
   */
  deleteFuelPrice: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/fuel-prices/${sanitizeUrlParam(id)}`);
    } catch (error) {
      secureLog.error('[FUEL-PRICES-API] Error deleting fuel price:', error);
      throw error;
    }
  }
};