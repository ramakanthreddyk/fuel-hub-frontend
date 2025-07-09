
/**
 * @file api/services/stationsService.ts
 * @description Service for stations API endpoints
 */
import apiClient, { extractData, extractArray } from '../core/apiClient';
import API_CONFIG from '../core/config';

// Types
export interface Station {
  id: string;
  name: string;
  address: string;
  status: 'active' | 'inactive' | 'maintenance';
  createdAt: string;
  updatedAt?: string;
  pumpCount?: number;
  nozzleCount?: number;
}

export interface CreateStationRequest {
  name: string;
  address: string;
  status?: 'active' | 'inactive' | 'maintenance';
}

export interface UpdateStationRequest {
  name?: string;
  address?: string;
  status?: 'active' | 'inactive' | 'maintenance';
}

/**
 * Service for stations API
 */
export const stationsService = {
  /**
   * Get all stations
   */
  getStations: async (): Promise<Station[]> => {
    try {
      console.log('[STATIONS-API] Fetching stations');
      const response = await apiClient.get('/stations');
      const stations = extractArray<Station>(response, 'stations');
      console.log(`[STATIONS-API] Successfully fetched ${stations.length} stations`);
      return stations;
    } catch (error) {
      console.error('[STATIONS-API] Error fetching stations:', error);
      throw error;
    }
  },
  
  /**
   * Get a station by ID
   */
  getStation: async (id: string): Promise<Station> => {
    try {
      console.log(`[STATIONS-API] Fetching station details for ID: ${id}`);
      const response = await apiClient.get(`/stations/${id}`);
      return extractData<Station>(response);
    } catch (error) {
      console.error(`[STATIONS-API] Error fetching station ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Create a new station
   */
  createStation: async (data: CreateStationRequest): Promise<Station> => {
    try {
      console.log('[STATIONS-API] Creating station with data:', data);
      const response = await apiClient.post('/stations', data);
      return extractData<Station>(response);
    } catch (error) {
      console.error('[STATIONS-API] Error creating station:', error);
      throw error;
    }
  },
  
  /**
   * Update a station
   */
  updateStation: async (id: string, data: UpdateStationRequest): Promise<Station> => {
    try {
      console.log(`[STATIONS-API] Updating station ${id} with data:`, data);
      const response = await apiClient.put(`/stations/${id}`, data);
      return extractData<Station>(response);
    } catch (error) {
      console.error(`[STATIONS-API] Error updating station ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete a station
   */
  deleteStation: async (id: string): Promise<void> => {
    try {
      console.log(`[STATIONS-API] Deleting station ${id}`);
      await apiClient.delete(`/stations/${id}`);
      console.log(`[STATIONS-API] Successfully deleted station ${id}`);
    } catch (error) {
      console.error(`[STATIONS-API] Error deleting station ${id}:`, error);
      throw error;
    }
  }
};

export default stationsService;
