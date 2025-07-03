/**
 * @file api/services/readingsService.ts
 * @description Service for readings API endpoints
 */
import apiClient, { extractData, extractArray } from '../core/apiClient';
import API_CONFIG from '../core/config';

// Types
export interface Reading {
  id: string;
  nozzleId: string;
  nozzleNumber?: number;
  pumpId?: string;
  pumpName?: string;
  stationId?: string;
  stationName?: string;
  reading: number;
  previousReading?: number;
  recordedAt: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
  creditorId?: string;
  creditorName?: string;
  createdAt: string;
  recordedBy?: string;
  status?: 'completed' | 'pending' | 'discrepancy';
  // Calculated fields
  volume?: number;
  amount?: number;
  pricePerLitre?: number;
}

export interface CreateReadingRequest {
  nozzleId: string;
  reading: number;
  recordedAt?: string; // Optional, defaults to current time
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
  creditorId?: string;
}

/**
 * Service for readings API
 */
export const readingsService = {
  /**
   * Get all readings
   * @param nozzleId Optional nozzle ID to filter by
   * @returns List of readings
   */
  getReadings: async (nozzleId?: string): Promise<Reading[]> => {
    try {
      console.log('[READINGS-API] Fetching readings');
      
      const params = nozzleId ? { nozzleId } : {};
      const response = await apiClient.get(API_CONFIG.endpoints.readings.base, { params });
      
      let readingsArray: Reading[] = [];
      
      if (response.data?.data?.readings) {
        readingsArray = response.data.data.readings;
      } else if (response.data?.readings) {
        readingsArray = response.data.readings;
      } else if (Array.isArray(response.data)) {
        readingsArray = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        readingsArray = response.data.data;
      } else {
        readingsArray = extractArray<Reading>(response, 'readings');
      }
      
      console.log(`[READINGS-API] Successfully fetched ${readingsArray.length} readings`);
      return readingsArray;
    } catch (error) {
      console.error('[READINGS-API] Error fetching readings:', error);
      throw error;
    }
  },
  
  /**
   * Get a reading by ID
   * @param id Reading ID
   * @returns Reading details
   */
  getReading: async (id: string): Promise<Reading> => {
    try {
      console.log(`[READINGS-API] Fetching reading details for ID: ${id}`);
      const response = await apiClient.get(`${API_CONFIG.endpoints.readings.base}/${id}`);
      return extractData<Reading>(response);
    } catch (error) {
      console.error(`[READINGS-API] Error fetching reading ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Get the latest reading for a nozzle
   * @param nozzleId Nozzle ID
   * @returns Latest reading for the nozzle
   */
  getLatestReading: async (nozzleId: string): Promise<Reading | null> => {
    try {
      if (!nozzleId) {
        return null;
      }
      
      console.log(`[READINGS-API] Fetching latest reading for nozzle ${nozzleId}`);
      
      // Get all readings for the nozzle
      const allReadings = await readingsService.getReadings(nozzleId);
      
      if (allReadings.length === 0) {
        return null;
      }
      
      // Sort by reading date (descending) and take the first one
      const sortedReadings = [...allReadings].sort((a, b) => {
        return new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime();
      });
      
      return sortedReadings[0];
    } catch (error) {
      console.error(`[READINGS-API] Error fetching latest reading for nozzle ${nozzleId}:`, error);
      return null;
    }
  },
  
  /**
   * Create a new reading
   * @param data Reading data
   * @returns Created reading
   */
  createReading: async (data: CreateReadingRequest): Promise<Reading> => {
    try {
      console.log('[READINGS-API] Creating reading with data:', data);
      const response = await apiClient.post(API_CONFIG.endpoints.readings.base, data);
      return extractData<Reading>(response);
    } catch (error) {
      console.error('[READINGS-API] Error creating reading:', error);
      throw error;
    }
  },

  /**
   * Check if reading can be created for nozzle
   * @param nozzleId Nozzle ID
   * @returns Can create reading status
   */
  canCreateReading: async (nozzleId: string): Promise<{ canCreate: boolean; reason?: string; missingPrice?: boolean }> => {
    try {
      const response = await apiClient.get(`${API_CONFIG.endpoints.readings.base}/can-create/${nozzleId}`);
      return extractData<{ canCreate: boolean; reason?: string; missingPrice?: boolean }>(response);
    } catch (error) {
      console.warn('Failed to check reading creation:', error);
      return { canCreate: false, reason: 'Unable to verify reading requirements' };
    }
  }
};

export default readingsService;
