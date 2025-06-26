
import { apiClient, extractApiData, extractApiArray } from './client';
import type { NozzleReading, CreateReadingRequest, ApiResponse } from './api-contract';

export const readingsApi = {
  // Create new reading
  createReading: async (readingData: CreateReadingRequest): Promise<NozzleReading> => {
    const response = await apiClient.post('/nozzle-readings', readingData);
    return extractApiData<NozzleReading>(response);
  },
  
  // Get latest reading for a nozzle
  getLatestReading: async (nozzleId: string): Promise<NozzleReading | null> => {
    try {
      const response = await apiClient.get(`/nozzle-readings?nozzleId=${nozzleId}`);
      const readings = extractApiArray<NozzleReading>(response, 'readings');
      
      if (readings.length === 0) return null;
      
      // Return the first (latest) reading
      return readings[0];
    } catch (error) {
      return null;
    }
  }
};

// Export types for backward compatibility
export type { NozzleReading, CreateReadingRequest };
