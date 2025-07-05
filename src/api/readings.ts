
import { apiClient, extractApiData, extractApiArray } from './client';
import type { NozzleReading, CreateReadingRequest, ApiResponse } from './api-contract';

export const readingsApi = {
  // Create new reading
  createReading: async (readingData: CreateReadingRequest): Promise<NozzleReading> => {
    try {
      console.log('[READINGS-API] Creating new reading:', readingData);
      const response = await apiClient.post('/nozzle-readings', readingData);
      console.log('[READINGS-API] Reading created successfully');
      return extractApiData<NozzleReading>(response);
    } catch (error) {
      console.error('[READINGS-API] Error creating reading:', error);
      // Don't let 401 errors cause logout - just pass the error up
      throw error;
    }
  },
  
  // Get latest reading for a nozzle
  getLatestReading: async (nozzleId: string): Promise<NozzleReading | null> => {
    try {
      const response = await apiClient.get(`/nozzle-readings?nozzleId=${nozzleId}&limit=1`);
      const readings = extractApiArray<NozzleReading>(response, 'readings');

      if (readings.length === 0) return null;

      return readings[0];
    } catch (error) {
      return null;
    }
  }
};

// Export types for backward compatibility
export type { NozzleReading, CreateReadingRequest };
