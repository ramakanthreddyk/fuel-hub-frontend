
import { apiClient, extractApiData, extractApiArray } from './client';
import type { Station, CreateStationRequest, ApiResponse } from './api-contract';

// Extended Station interface for stations with metrics
interface StationWithMetrics extends Station {
  metrics?: {
    totalSales: number;
    activePumps: number;
    totalPumps: number;
  };
}

export const stationsApi = {
  // Get all stations for current tenant
  getStations: async (includeMetrics = false): Promise<StationWithMetrics[]> => {
    try {
      const params = includeMetrics ? '?includeMetrics=true' : '';
      console.log(`[STATIONS-API] Fetching stations with URL: /stations${params}`);
      
      // Use direct fetch with the correct API URL to ensure it always hits the backend
      const apiUrl = 'https://fuelsync-api-demo-bvadbhg8bdbmg0ff.germanywestcentral-01.azurewebsites.net';
      const token = localStorage.getItem('fuelsync_token');
      const user = JSON.parse(localStorage.getItem('fuelsync_user') || '{}');
      const tenantId = user.tenantId || '';
      
      console.log(`[STATIONS-API] Making direct fetch to ${apiUrl}/api/v1/stations${params}`);
      
      const response = await fetch(`${apiUrl}/api/v1/stations${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-tenant-id': tenantId,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('[STATIONS-API] Raw response:', result);
      
      // Extract stations from different possible response formats
      let stationsArray = [];
      
      if (result.success && result.data && result.data.stations) {
        stationsArray = result.data.stations;
      } else if (result.stations) {
        stationsArray = result.stations;
      } else if (Array.isArray(result)) {
        stationsArray = result;
      } else if (result.data && Array.isArray(result.data)) {
        stationsArray = result.data;
      }
      
      console.log(`[STATIONS-API] Successfully fetched ${stationsArray.length} stations`);
      return stationsArray;
    } catch (error) {
      console.error('[STATIONS-API] Error fetching stations:', error);
      throw error; // Throw error to trigger React Query's retry mechanism
    }
  },
  
  // Create new station
  createStation: async (data: CreateStationRequest): Promise<Station> => {
    try {
      console.log('[STATIONS-API] Creating station with data:', data);
      const response = await apiClient.post('/stations', data);
      const station = extractApiData<Station>(response);
      console.log('[STATIONS-API] Successfully created station:', station.id);
      return station;
    } catch (error) {
      console.error('[STATIONS-API] Error creating station:', error);
      throw error;
    }
  },
  
  // Get station by ID - CORRECTED: Uses /stations/{stationId}
  getStation: async (stationId: string): Promise<Station> => {
    try {
      console.log(`[STATIONS-API] Fetching station details for ID: ${stationId} using URL: /stations/${stationId}`);
      const response = await apiClient.get(`/stations/${stationId}`);
      const station = extractApiData<Station>(response);
      console.log(`[STATIONS-API] Successfully fetched station: ${station.name}`);
      return station;
    } catch (error) {
      console.error(`[STATIONS-API] Error fetching station ${stationId}:`, error);
      throw error;
    }
  },

  // Update station
  updateStation: async (stationId: string, data: Partial<CreateStationRequest>): Promise<Station> => {
    try {
      console.log(`[STATIONS-API] Updating station ${stationId} with data:`, data);
      const response = await apiClient.put(`/stations/${stationId}`, data);
      const station = extractApiData<Station>(response);
      console.log(`[STATIONS-API] Successfully updated station: ${station.id}`);
      return station;
    } catch (error) {
      console.error(`[STATIONS-API] Error updating station ${stationId}:`, error);
      throw error;
    }
  },

  // Delete station
  deleteStation: async (stationId: string): Promise<void> => {
    try {
      console.log(`[STATIONS-API] Deleting station ${stationId}`);
      await apiClient.delete(`/stations/${stationId}`);
      console.log(`[STATIONS-API] Successfully deleted station: ${stationId}`);
    } catch (error) {
      console.error(`[STATIONS-API] Error deleting station ${stationId}:`, error);
      throw error;
    }
  }
};

// Export types for backward compatibility
export type { Station, CreateStationRequest, StationWithMetrics };
