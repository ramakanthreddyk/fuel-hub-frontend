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
      
      // Use query parameter approach as per API spec
      const params = nozzleId ? { nozzleId } : {};
      const response = await apiClient.get(API_CONFIG.endpoints.readings.base, { params });
      
      // Extract readings from response
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
      
      // If no readings are returned, use mock data for development
      if (readingsArray.length === 0 && process.env.NODE_ENV === 'development') {
        console.log('[READINGS-API] Using mock data for development');
        return [
          {
            id: '1',
            nozzleId: 'N001',
            nozzleNumber: 1,
            pumpId: 'P001',
            pumpName: 'Pump 1 - Petrol',
            stationId: 'S001',
            stationName: 'Downtown Station',
            reading: 125834.50,
            previousReading: 125712.25,
            recordedAt: '2024-01-15 14:30:00',
            paymentMethod: 'cash',
            createdAt: '2024-01-15 14:30:00',
            recordedBy: 'John Doe',
            status: 'completed',
            volume: 122.25,
            amount: 12225.00,
            pricePerLitre: 100.00
          }
        ];
      }
      
      return readingsArray;
    } catch (error) {
      console.error('[READINGS-API] Error fetching readings:', error);
      
      // Return mock data for development if API fails
      if (process.env.NODE_ENV === 'development') {
        console.log('[READINGS-API] Using mock data for development due to API error');
        return [
          {
            id: '1',
            nozzleId: 'N001',
            nozzleNumber: 1,
            pumpId: 'P001',
            pumpName: 'Pump 1 - Petrol',
            stationId: 'S001',
            stationName: 'Downtown Station',
            reading: 125834.50,
            previousReading: 125712.25,
            recordedAt: '2024-01-15 14:30:00',
            paymentMethod: 'cash',
            createdAt: '2024-01-15 14:30:00',
            recordedBy: 'John Doe',
            status: 'completed',
            volume: 122.25,
            amount: 12225.00,
            pricePerLitre: 100.00
          }
        ];
      }
      
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
      const response = await apiClient.get(`${API_CONFIG.endpoints.readings.base}/latest/${nozzleId}`);
      return extractData<Reading>(response);
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
  }
};

export default readingsService;