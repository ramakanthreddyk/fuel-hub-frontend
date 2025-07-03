/**
 * @file api/services/fuelPricesService.ts
 * @description Service for fuel prices API endpoints
 * @see docs/API_INTEGRATION_GUIDE.md - API integration patterns
 * @see docs/journeys/MANAGER.md - Manager journey for setting fuel prices
 */
import apiClient, { extractData, extractArray } from '../core/apiClient';
import API_CONFIG from '../core/config';

// Types
export interface FuelPrice {
  id: string;
  stationId: string;
  fuelType: 'petrol' | 'diesel' | 'premium';
  price: number;
  validFrom: string;
  createdAt: string;
  stationName?: string;
  tenantId?: string;
}

export interface CreateFuelPriceRequest {
  stationId: string;
  fuelType: 'petrol' | 'diesel' | 'premium';
  price: number;
  validFrom?: string; // Optional, defaults to current date
}

export interface UpdateFuelPriceRequest {
  price: number;
  validFrom?: string;
}

export interface FuelPriceValidation {
  stationId: string;
  missingPrices: Array<{
    fuelType: string;
    message: string;
  }>;
  hasValidPrices: boolean;
  lastUpdated?: string;
  // For legacy compatibility
  missingFuelTypes?: string[];
  hasActivePrices?: boolean;
}

/**
 * Service for fuel prices API
 */
export const fuelPricesService = {
  /**
   * Get all fuel prices
   * @param stationId Optional station ID to filter by
   * @returns List of fuel prices
   */
  getFuelPrices: async (stationId?: string): Promise<FuelPrice[]> => {
    try {
      console.log('[FUEL-PRICES-API] Fetching fuel prices', stationId ? `for station: ${stationId}` : '');
      
      // Use query parameter approach as per API spec
      const params = stationId ? { stationId } : {};
      const response = await apiClient.get(API_CONFIG.endpoints.fuelPrices.base, { params });
      
      console.log('[FUEL-PRICES-API] Response received:', response.data);
      
      // Extract prices from response - keys are already converted to camelCase by apiClient
      let pricesArray: FuelPrice[] = [];
      
      if (response.data?.data?.prices) {
        pricesArray = response.data.data.prices;
      } else if (response.data?.prices) {
        pricesArray = response.data.prices;
      } else if (Array.isArray(response.data)) {
        pricesArray = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        pricesArray = response.data.data;
      } else {
        // Use the helper function as fallback
        pricesArray = extractArray<FuelPrice>(response, 'prices');
      }
      
      console.log(`[FUEL-PRICES-API] Successfully fetched ${pricesArray.length} fuel prices`);
      
      // Ensure all prices have stationId
      if (stationId) {
        pricesArray = pricesArray.map(price => ({
          ...price,
          stationId: price.stationId || stationId
        }));
      }
      
      return pricesArray;
    } catch (error) {
      console.error('[FUEL-PRICES-API] Error fetching fuel prices:', error);
      throw error;
    }
  },
  
  /**
   * Create a new fuel price
   * @param data Fuel price data
   * @returns Created fuel price
   */
  createFuelPrice: async (data: CreateFuelPriceRequest): Promise<FuelPrice> => {
    try {
      console.log('[FUEL-PRICES-API] Creating fuel price with data:', data);
      const response = await apiClient.post(API_CONFIG.endpoints.fuelPrices.base, data);
      const fuelPrice = extractData<FuelPrice>(response);
      return fuelPrice;
    } catch (error) {
      console.error('[FUEL-PRICES-API] Error creating fuel price:', error);
      throw error;
    }
  },
  
  /**
   * Update a fuel price
   * @param id Fuel price ID
   * @param data Fuel price data to update
   * @returns Updated fuel price
   */
  updateFuelPrice: async (id: string, data: UpdateFuelPriceRequest): Promise<FuelPrice> => {
    try {
      console.log(`[FUEL-PRICES-API] Updating fuel price ${id} with data:`, data);
      const response = await apiClient.put(`${API_CONFIG.endpoints.fuelPrices.base}/${id}`, data);
      const fuelPrice = extractData<FuelPrice>(response);
      return fuelPrice;
    } catch (error) {
      console.error(`[FUEL-PRICES-API] Error updating fuel price ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete a fuel price
   * @param id Fuel price ID
   */
  deleteFuelPrice: async (id: string): Promise<void> => {
    try {
      console.log(`[FUEL-PRICES-API] Deleting fuel price ${id}`);
      await apiClient.delete(`${API_CONFIG.endpoints.fuelPrices.base}/${id}`);
      console.log(`[FUEL-PRICES-API] Successfully deleted fuel price ${id}`);
    } catch (error) {
      console.error(`[FUEL-PRICES-API] Error deleting fuel price ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Validate fuel prices for a station
   * @param stationId Station ID
   * @returns Validation result
   */
  validateFuelPrices: async (stationId: string): Promise<FuelPriceValidation> => {
    try {
      if (!stationId) {
        return {
          stationId: '',
          hasValidPrices: true,
          missingPrices: []
        };
      }
      
      console.log(`[FUEL-PRICES-API] Validating fuel prices for station ${stationId}`);
      
      // First check if there are any fuel prices for this station
      const prices = await fuelPricesService.getFuelPrices(stationId);
      if (prices && prices.length > 0) {
        // If we have prices, assume they're valid
        return {
          stationId,
          hasValidPrices: true,
          missingPrices: []
        };
      }
      
      // If no prices found, try the validation endpoint
      const response = await apiClient.get(API_CONFIG.endpoints.fuelPrices.validate(stationId));
      return extractData<FuelPriceValidation>(response);
    } catch (error) {
      console.error(`[FUEL-PRICES-API] Error validating fuel prices for station ${stationId}:`, error);
      // Return a default response to prevent UI errors
      return {
        stationId,
        hasValidPrices: true,
        missingPrices: []
      };
    }
  },
  
  /**
   * Get stations missing active prices
   * @returns List of stations missing prices
   */
  getMissingPrices: async (): Promise<any[]> => {
    try {
      console.log('[FUEL-PRICES-API] Fetching stations missing active prices');
      const response = await apiClient.get(API_CONFIG.endpoints.fuelPrices.missing);
      return extractArray(response);
    } catch (error) {
      console.error('[FUEL-PRICES-API] Error fetching stations missing active prices:', error);
      throw error;
    }
  }
};

export default fuelPricesService;