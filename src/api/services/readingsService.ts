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

export interface UpdateReadingRequest {
  reading?: number;
  recordedAt?: string;
  paymentMethod?: 'cash' | 'card' | 'upi' | 'credit';
  creditorId?: string | null;
}

/**
 * Service for readings API
 */
export const readingsService = {
  /**
   * Get all readings
   * @param options Optional filter options
   * @returns List of readings
   */
  getReadings: async (options?: { nozzleId?: string; limit?: number }): Promise<Reading[]> => {
    try {
      console.log('[READINGS-API] Fetching readings');

      const params: Record<string, any> = {};
      if (options?.nozzleId) params.nozzleId = options.nozzleId;
      if (options?.limit) params.limit = options.limit;
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

      readingsArray = readingsArray.map((r: any) => ({
        id: r.id,
        nozzleId: r.nozzleId || r.nozzle_id,
        nozzleNumber: r.nozzleNumber ?? r.nozzle_number,
        pumpName: r.pumpName || r.pump_name,
        stationId: r.stationId || r.station_id,
        stationName: r.stationName || r.station_name,
        reading: r.reading,
        previousReading: r.previousReading ?? r.previous_reading,
        recordedAt: r.recordedAt || r.recorded_at,
        paymentMethod: r.paymentMethod || r.payment_method,
        creditorId: r.creditorId || r.creditor_id,
        creditorName: r.creditorName || r.creditor_name,
        createdAt: r.createdAt || r.created_at,
        recordedBy: r.recordedBy || r.recorded_by || r.attendantName || r.attendant_name,
        status: r.status,
        volume: r.volume,
        amount: r.amount,
        pricePerLitre: r.pricePerLitre || r.price_per_litre,
        fuelType: r.fuelType || r.fuel_type
      }));

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

      const readings = await readingsService.getReadings({ nozzleId, limit: 1 });

      if (readings.length === 0) {
        return null;
      }

      return readings[0];
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
   * Update an existing reading
   */
  updateReading: async (
    id: string,
    data: UpdateReadingRequest
  ): Promise<Reading> => {
    try {
      console.log(`[READINGS-API] Updating reading ${id} with data:`, data);
      const response = await apiClient.put(
        `${API_CONFIG.endpoints.readings.base}/${id}`,
        data
      );
      return extractData<Reading>(response);
    } catch (error) {
      console.error(`[READINGS-API] Error updating reading ${id}:`, error);
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
