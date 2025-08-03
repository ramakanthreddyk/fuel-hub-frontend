
import { apiClient, extractApiData, extractApiArray } from './client';
import type { NozzleReading, CreateReadingRequest, ApiResponse } from './api-contract';
import { parseReadingsResponse, parseReading } from '@/utils/dataParser';

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
      if (!nozzleId) {
        console.warn('[READINGS-API] No nozzleId provided for getLatestReading');
        return null;
      }
      
      // Validate UUID format before sending to API
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(nozzleId)) {
        console.error('[READINGS-API] Invalid UUID format for nozzleId:', nozzleId);
        return null;
      }
      
      const response = await apiClient.get(`/nozzle-readings?nozzleId=${nozzleId}&limit=1`);

      // Parse the complex data format from backend
      const parsedResponse = parseReadingsResponse(response.data);
      const readings = parsedResponse.data?.readings || [];

      if (readings.length === 0) return null;

      return readings[0];
    } catch (error) {
      console.error('[READINGS-API] Error in getLatestReading:', error);
      return null;
    }
  }
};

// Export types for backward compatibility
export type { NozzleReading, CreateReadingRequest };
