
import { apiClient, extractApiData, extractApiArray } from './client';
import type { Station, CreateStationRequest, ApiResponse } from './api-contract';

export const stationsApi = {
  // Get all stations for current tenant
  getStations: async (includeMetrics = false): Promise<Station[]> => {
    try {
      const params = includeMetrics ? '?includeMetrics=true' : '';
      const response = await apiClient.get(`/stations${params}`);
      
      // Use standardized array extraction
      return extractApiArray<Station>(response, 'stations');
    } catch (error) {
      console.error('Error fetching stations:', error);
      return [];
    }
  },
  
  // Create new station
  createStation: async (data: CreateStationRequest): Promise<Station> => {
    try {
      console.log('Creating station with data:', data);
      const response = await apiClient.post('/stations', data);
      return extractApiData<Station>(response);
    } catch (error) {
      console.error('Error creating station:', error);
      throw error;
    }
  },
  
  // Get station by ID
  getStation: async (stationId: string): Promise<Station> => {
    try {
      const response = await apiClient.get(`/stations/${stationId}`);
      return extractApiData<Station>(response);
    } catch (error) {
      console.error(`Error fetching station ${stationId}:`, error);
      throw error;
    }
  },

  // Update station
  updateStation: async (stationId: string, data: Partial<CreateStationRequest>): Promise<Station> => {
    try {
      console.log(`Updating station ${stationId} with data:`, data);
      const response = await apiClient.put(`/stations/${stationId}`, data);
      return extractApiData<Station>(response);
    } catch (error) {
      console.error(`Error updating station ${stationId}:`, error);
      throw error;
    }
  },

  // Delete station
  deleteStation: async (stationId: string): Promise<void> => {
    try {
      console.log(`Deleting station ${stationId}`);
      await apiClient.delete(`/stations/${stationId}`);
    } catch (error) {
      console.error(`Error deleting station ${stationId}:`, error);
      throw error;
    }
  }
};

// Export types for backward compatibility
export type { Station, CreateStationRequest };
