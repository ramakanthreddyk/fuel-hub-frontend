
import { apiClient, extractApiData, extractApiArray } from './client';
import type { FuelPriceValidation, FuelPrice } from './api-contract';
import { secureLog, sanitizeUrlParam } from '@/utils/security';

const devLog = (message: string, ...args: any[]) => {
  if (import.meta.env.DEV) {
    secureLog.debug(`[FUEL-PRICE-VALIDATION-API] ${message}`, ...args);
  }
};

export const fuelPriceValidationApi = {
  // Validate fuel prices for a station
  validateStationPrices: async (stationId: string): Promise<FuelPriceValidation> => {
    devLog('Validating fuel prices for station', stationId);
    const response = await apiClient.get(`/fuel-prices/validate/${sanitizeUrlParam(stationId)}`);
    return extractApiData<FuelPriceValidation>(response);
  },

  // Get missing fuel prices for all stations
  getMissingPrices: async (): Promise<FuelPriceValidation[]> => {
    devLog('Fetching missing fuel prices for all stations');
    const response = await apiClient.get('/fuel-prices/missing');
    return extractApiArray<FuelPriceValidation>(response, 'validations');
  },

  // Check if reading can be created (has valid fuel prices)
  canCreateReading: async (nozzleId: string): Promise<{ canCreate: boolean; missingPrice?: boolean; reason?: string }> => {
    devLog('Checking if reading can be created for nozzle', nozzleId);
    const response = await apiClient.get(`/nozzle-readings/can-create/${sanitizeUrlParam(nozzleId)}`);
    return extractApiData<{ canCreate: boolean; missingPrice?: boolean; reason?: string }>(response);
  }
};

// Export types
export type { FuelPriceValidation };
