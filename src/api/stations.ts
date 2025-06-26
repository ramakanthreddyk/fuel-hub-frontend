
import { apiClient, extractApiData, extractApiArray } from './client';
import type { Station, CreateStationRequest, ApiResponse } from './api-contract';

export const stationsApi = {
  // Get all stations for current tenant
  getStations: async (includeMetrics = false): Promise<Station[]> => {
    try {
      const params = includeMetrics ? '?includeMetrics=true' : '';
      const response = await apiClient.get(`/stations${params}`);
      
      // Use standardized array extraction
      return extractApiArray<Station>(response);
    } catch (error) {
      console.error('Error fetching stations:', error);
      return [];
    }
  },
  
  // Create new station
  createStation: async (data: CreateStationRequest): Promise<Station> => {
    const response = await apiClient.post('/stations', data);
    return extractApiData<Station>(response);
  },
  
  // Get station by ID
  getStation: async (stationId: string): Promise<Station> => {
    const response = await apiClient.get(`/stations/${stationId}`);
    return extractApiData<Station>(response);
  }
};

// Export types for backward compatibility
export type { Station, CreateStationRequest };
