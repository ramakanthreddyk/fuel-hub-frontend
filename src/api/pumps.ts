import { apiClient, extractApiData, extractApiArray } from './client';
import type { Pump, CreatePumpRequest, ApiResponse } from './api-contract';

export const pumpsApi = {
  // Get pumps for a station
  getPumps: async (stationId: string): Promise<Pump[]> => {
    try {
      console.log(`[PUMPS-API] Fetching pumps for station: ${stationId}`);
      
      // Use the correct API endpoint according to the API spec
      const url = stationId === 'all' ? '/pumps' : `/pumps?stationId=${stationId}`;
      
      console.log(`[PUMPS-API] Making request to: ${url}`);
      const response = await apiClient.get(url);
      
      // Extract pumps from response using the helper function
      // Try different possible response formats
      let pumps: Pump[] = [];
      
      if (response.data?.data?.pumps) {
        // Format: { data: { pumps: [...] } }
        pumps = response.data.data.pumps;
      } else if (response.data?.pumps) {
        // Format: { pumps: [...] }
        pumps = response.data.pumps;
      } else if (Array.isArray(response.data)) {
        // Format: [...]
        pumps = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        // Format: { data: [...] }
        pumps = response.data.data;
      } else {
        // Use the helper function as fallback
        pumps = extractApiArray<Pump>(response, 'pumps');
      }
      
      console.log(`[PUMPS-API] Successfully fetched ${pumps.length} pumps`);
      
      return pumps;
    } catch (error) {
      console.error('[PUMPS-API] Error fetching pumps:', error);
      throw error; // Throw error to trigger React Query's retry mechanism
    }
  },
  
  // Create new pump
  createPump: async (data: CreatePumpRequest): Promise<Pump> => {
    try {
      console.log('[PUMPS-API] Creating pump with data:', data);
      
      const response = await apiClient.post('/pumps', data);
      const payload = extractApiData<any>(response);
      const pump: Pump = payload.pump ?? payload;
      
      console.log('[PUMPS-API] Pump created successfully:', pump);
      return pump;
    } catch (error) {
      console.error('[PUMPS-API] Error creating pump:', error);
      throw error;
    }
  },
  
  // Get single pump
  getPump: async (pumpId: string): Promise<Pump> => {
    try {
      console.log(`[PUMPS-API] Fetching pump details for ID: ${pumpId}`);
      
      const response = await apiClient.get(`/pumps/${pumpId}`);
      const payload = extractApiData<any>(response);
      const pump: Pump = payload.pump ?? payload;
      
      console.log('[PUMPS-API] Pump details:', pump);
      return pump;
    } catch (error) {
      console.error(`[PUMPS-API] Error fetching pump ${pumpId}:`, error);
      throw error;
    }
  },
  
  // Delete pump
  deletePump: async (pumpId: string): Promise<void> => {
    try {
      console.log(`[PUMPS-API] Deleting pump ${pumpId}`);
      
      await apiClient.delete(`/pumps/${pumpId}`);
      console.log(`[PUMPS-API] Pump ${pumpId} deleted successfully`);
    } catch (error) {
      console.error(`[PUMPS-API] Error deleting pump ${pumpId}:`, error);
      throw error;
    }
  }
};

// Export types for backward compatibility
export type { Pump, CreatePumpRequest };
