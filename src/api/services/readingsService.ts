
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
  nozzle_id?: string; // For backward compatibility
  reading: number;
  previousReading?: number;
  previous_reading?: number; // For backward compatibility
  recordedAt: string;
  recorded_at?: string; // For backward compatibility
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit' | 'bank_transfer' | 'check';
  payment_method?: string; // For backward compatibility
  creditorId?: string;
  creditor_id?: string; // For backward compatibility
  notes?: string;
  createdAt: string;
  created_at?: string; // For backward compatibility
  updatedAt?: string;
  updated_at?: string; // For backward compatibility
  // Enriched data
  nozzleNumber?: number;
  nozzle_number?: number; // For backward compatibility
  fuelType?: string;
  fuel_type?: string; // For backward compatibility
  pumpName?: string;
  pump_name?: string; // For backward compatibility
  stationName?: string;
  station_name?: string; // For backward compatibility
  pumpId?: string;
  pump_id?: string; // For backward compatibility
  stationId?: string;
  station_id?: string; // For backward compatibility
  attendantName?: string;
  attendant_name?: string; // For backward compatibility
  recordedBy?: string;
  amount?: number;
  pricePerLitre?: number;
  price_per_litre?: number; // For backward compatibility
  volume?: number;
}

export interface CreateReadingRequest {
  nozzleId: string;
  reading: number;
  recordedAt?: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit' | 'bank_transfer' | 'check';
  creditorId?: string;
  notes?: string;
}

export interface UpdateReadingRequest {
  reading?: number;
  recordedAt?: string;
  paymentMethod?: 'cash' | 'card' | 'upi' | 'credit' | 'bank_transfer' | 'check';
  creditorId?: string;
  notes?: string;
}

export interface VoidReadingRequest {
  reason: string;
  status?: 'voided';
}

/**
 * Service for readings API
 */
export const readingsService = {
  /**
   * Get all readings
   */
  getReadings: async (): Promise<Reading[]> => {
    try {
      console.log('[READINGS-API] Fetching readings');
      const response = await apiClient.get(API_CONFIG.endpoints.readings.base);
      const readings = extractArray<Reading>(response, 'readings');
      console.log(`[READINGS-API] Successfully fetched ${readings.length} readings`);
      return readings;
    } catch (error) {
      console.error('[READINGS-API] Error fetching readings:', error);
      throw error;
    }
  },
  
  /**
   * Get a reading by ID
   */
  getReading: async (id: string): Promise<Reading> => {
    try {
      console.log(`[READINGS-API] Fetching reading details for ID: ${id}`);
      const response = await apiClient.get(API_CONFIG.endpoints.readings.byId(id));
      return extractData<Reading>(response);
    } catch (error) {
      console.error(`[READINGS-API] Error fetching reading ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Create a new reading
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
   * Update a reading
   */
  updateReading: async (id: string, data: UpdateReadingRequest): Promise<Reading> => {
    try {
      console.log(`[READINGS-API] Updating reading ${id} with data:`, data);
      const response = await apiClient.put(API_CONFIG.endpoints.readings.byId(id), data);
      return extractData<Reading>(response);
    } catch (error) {
      console.error(`[READINGS-API] Error updating reading ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Get latest reading for a nozzle
   * According to OpenAPI spec, this uses the /nozzle-readings endpoint with nozzleId and limit=1
   */
  getLatestReading: async (nozzleId: string): Promise<Reading | null> => {
    try {
      console.log(`[READINGS-API] Fetching latest reading for nozzle: ${nozzleId}`);
      // Use limit=1 to get only the most recent reading as per OpenAPI spec
      const response = await apiClient.get(`${API_CONFIG.endpoints.readings.base}?nozzleId=${nozzleId}&limit=1`);
      const readings = extractArray<Reading>(response, 'readings');
      
      if (readings.length === 0) {
        console.log(`[READINGS-API] No readings found for nozzle ${nozzleId}`);
        return null;
      }
      
      // Normalize property names to handle both camelCase and snake_case
      const reading = readings[0];
      
      // Ensure paymentMethod is one of the allowed values
      const paymentMethod = (reading.paymentMethod || reading.payment_method || 'cash') as 'cash' | 'card' | 'upi' | 'credit' | 'bank_transfer' | 'check';
      
      const normalizedReading = {
        ...reading,
        id: reading.id,
        nozzleId: reading.nozzleId || reading.nozzle_id,
        reading: typeof reading.reading === 'number' ? reading.reading : parseFloat(reading.reading),
        nozzleNumber: reading.nozzleNumber || reading.nozzle_number,
        previousReading: reading.previousReading || reading.previous_reading,
        recordedAt: reading.recordedAt || reading.recorded_at,
        paymentMethod: paymentMethod,
        creditorId: reading.creditorId || reading.creditor_id,
        createdAt: reading.createdAt || reading.created_at,
        updatedAt: reading.updatedAt || reading.updated_at,
        fuelType: reading.fuelType || reading.fuel_type,
        pumpName: reading.pumpName || reading.pump_name,
        stationName: reading.stationName || reading.station_name,
        pumpId: reading.pumpId || reading.pump_id,
        stationId: reading.stationId || reading.station_id,
        attendantName: reading.attendantName || reading.attendant_name,
        pricePerLitre: reading.pricePerLitre || reading.price_per_litre,
        volume: reading.volume !== undefined ? reading.volume : (reading.reading - (reading.previousReading || 0))
      };
      
      console.log(`[READINGS-API] Successfully fetched latest reading for nozzle ${nozzleId}:`, normalizedReading.reading);
      return normalizedReading;
    } catch (error) {
      console.error(`[READINGS-API] Error fetching latest reading for nozzle ${nozzleId}:`, error);
      // Return null instead of throwing to handle missing readings gracefully
      return null;
    }
  },
  
  /**
   * Check if a reading can be created for a nozzle
   */
  canCreateReading: async (nozzleId: string): Promise<{ canCreate: boolean; reason?: string; missingPrice?: boolean }> => {
    try {
      console.log(`[READINGS-API] Checking if reading can be created for nozzle: ${nozzleId}`);
      const response = await apiClient.get(API_CONFIG.endpoints.readings.canCreate(nozzleId));
      return extractData<{ canCreate: boolean; reason?: string; missingPrice?: boolean }>(response);
    } catch (error) {
      console.error(`[READINGS-API] Error checking reading creation for nozzle ${nozzleId}:`, error);
      throw error;
    }
  },
  
  /**
   * Void a reading (mark as invalid)
   */
  voidReading: async (id: string, reason: string): Promise<any> => {
    try {
      console.log(`[READINGS-API] Voiding reading ${id} with reason: ${reason}`);
      const response = await apiClient.post(API_CONFIG.endpoints.readings.void(id), { reason, status: 'voided' });
      return extractData<any>(response);
    } catch (error) {
      console.error(`[READINGS-API] Error voiding reading ${id}:`, error);
      throw error;
    }
  }
};

export default readingsService;
