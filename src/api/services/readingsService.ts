
/**
 * @file readingsService.ts
 * @description Service for nozzle readings API operations
 */
import { apiClient, extractApiData, extractApiArray } from '@/api/client';
import API_CONFIG from '@/api/core/config';

export interface Reading {
  id: string;
  nozzleId: string;
  nozzleNumber?: number;
  reading: number;
  recordedAt: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
  creditorId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReadingRequest {
  nozzleId: string;
  reading: number;
  recordedAt: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
  creditorId?: string;
}

export interface UpdateReadingRequest {
  reading?: number;
  recordedAt?: string;
  paymentMethod?: 'cash' | 'card' | 'upi' | 'credit';
  creditorId?: string;
}

export const readingsService = {
  /**
   * Get all readings
   */
  getReadings: async (): Promise<Reading[]> => {
    const response = await apiClient.get(API_CONFIG.endpoints.readings.base);
    return extractApiArray<Reading>(response, 'readings');
  },

  /**
   * Get a reading by ID
   */
  getReading: async (id: string): Promise<Reading> => {
    const response = await apiClient.get(API_CONFIG.endpoints.readings.byId(id));
    return extractApiData<Reading>(response);
  },

  /**
   * Create a new reading
   */
  createReading: async (data: CreateReadingRequest): Promise<Reading> => {
    const response = await apiClient.post(API_CONFIG.endpoints.readings.base, data);
    return extractApiData<Reading>(response);
  },

  /**
   * Update a reading
   */
  updateReading: async (id: string, data: UpdateReadingRequest): Promise<Reading> => {
    const response = await apiClient.put(API_CONFIG.endpoints.readings.byId(id), data);
    return extractApiData<Reading>(response);
  },

  /**
   * Delete a reading
   */
  deleteReading: async (id: string): Promise<void> => {
    await apiClient.delete(API_CONFIG.endpoints.readings.byId(id));
  },

  /**
   * Get the latest reading for a nozzle
   */
  getLatestReading: async (nozzleId: string): Promise<Reading | null> => {
    try {
      const response = await apiClient.get(`${API_CONFIG.endpoints.readings.base}/latest/${nozzleId}`);
      return extractApiData<Reading>(response);
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Check if a reading can be created for a nozzle
   */
  canCreateReading: async (nozzleId: string): Promise<{ canCreate: boolean; reason?: string; missingPrice?: boolean }> => {
    try {
      const response = await apiClient.get(API_CONFIG.endpoints.readings.canCreate(nozzleId));
      return extractApiData(response);
    } catch (error: any) {
      return {
        canCreate: false,
        reason: error.response?.data?.message || 'Unable to validate reading creation',
        missingPrice: error.response?.status === 400
      };
    }
  },
};
