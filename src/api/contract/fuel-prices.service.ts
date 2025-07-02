/**
 * Fuel Prices Service - Contract-aligned API service
 * 
 * This service follows the OpenAPI specification exactly.
 */

import { contractClient } from '../contract-client';
import type { FuelPrice, CreateFuelPriceRequest } from '../api-contract';

export const fuelPricesService = {
  /**
   * Get all fuel prices
   */
  async getFuelPrices(): Promise<FuelPrice[]> {
    return contractClient.getArray<FuelPrice>('/fuel-prices', 'fuelPrices');
  },

  /**
   * Create new fuel price
   */
  async createFuelPrice(data: CreateFuelPriceRequest): Promise<FuelPrice> {
    return contractClient.post<FuelPrice>('/fuel-prices', data);
  },

  /**
   * Update fuel price
   */
  async updateFuelPrice(priceId: string, data: Partial<CreateFuelPriceRequest>): Promise<FuelPrice> {
    return contractClient.put<FuelPrice>(`/fuel-prices/${priceId}`, data);
  },

  /**
   * Delete fuel price
   */
  async deleteFuelPrice(priceId: string): Promise<void> {
    await contractClient.delete(`/fuel-prices/${priceId}`);
  },

  /**
   * Validate fuel prices for a station
   */
  async validateStationPrices(stationId: string): Promise<{
    hasActivePrices: boolean;
    missingFuelTypes?: string[];
  }> {
    return contractClient.get<{
      hasActivePrices: boolean;
      missingFuelTypes?: string[];
    }>(`/fuel-prices/validate/${stationId}`);
  },

  /**
   * Get stations missing active prices
   */
  async getStationsMissingPrices(): Promise<any[]> {
    return contractClient.getArray<any>('/fuel-prices/missing', 'stations');
  }
};