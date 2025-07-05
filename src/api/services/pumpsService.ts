/**
 * @file api/services/pumpsService.ts
 * @description Service for pumps API endpoints
 */
import apiClient, { extractData, extractArray } from '../core/apiClient';
import API_CONFIG from '../core/config';

// Types
export interface Pump {
  id: string;
  stationId: string;
  name: string;
  serialNumber: string;
  status: 'active' | 'inactive' | 'maintenance';
  createdAt: string;
  nozzleCount: number;
}

export interface CreatePumpRequest {
  stationId: string;
  name: string;
  serialNumber: string;
}

export interface UpdatePumpRequest {
  name?: string;
  serialNumber?: string;
  status?: 'active' | 'inactive' | 'maintenance';
}

/**
 * Service for pumps API
 */
export const pumpsService = {
  /**
   * Get all pumps
   * @param stationId Optional station ID to filter by
   * @returns List of pumps
   */
  getPumps: async (stationId?: string): Promise<Pump[]> => {
    try {
      console.log(`[PUMPS-API] Fetching pumps${stationId ? ` for station: ${stationId}` : ''}`);
      
      // Use query parameter approach as per API spec
      const params = stationId ? { stationId } : {};
      const response = await apiClient.get(API_CONFIG.endpoints.pumps.base, { params });
      
      // Extract pumps from response
      let pumpsArray: Pump[] = [];
      
      if (response.data?.data?.pumps) {
        pumpsArray = response.data.data.pumps;
      } else if (response.data?.pumps) {
        pumpsArray = response.data.pumps;
      } else if (Array.isArray(response.data)) {
        pumpsArray = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        pumpsArray = response.data.data;
      } else {
        pumpsArray = extractArray<Pump>(response, 'pumps');
      }
      
      console.log(`[PUMPS-API] Successfully fetched ${pumpsArray.length} pumps`);
      
      // Ensure all pumps have stationId
      if (stationId) {
        pumpsArray = pumpsArray.map(pump => ({
          ...pump,
          stationId: pump.stationId || stationId
        }));
      }
      
      return pumpsArray;
    } catch (error) {
      console.error('[PUMPS-API] Error fetching pumps:', error);
      throw error;
    }
  },
  
  /**
   * Get a pump by ID
   * @param id Pump ID
   * @returns Pump details
   */
  getPump: async (id: string): Promise<Pump> => {
    try {
      console.log(`[PUMPS-API] Fetching pump details for ID: ${id}`);
      const response = await apiClient.get(`${API_CONFIG.endpoints.pumps.base}/${id}`);
      const payload = extractData<any>(response);
      return (payload.pump ?? payload) as Pump;
    } catch (error) {
      console.error(`[PUMPS-API] Error fetching pump ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Create a new pump
   * @param data Pump data
   * @returns Created pump
   */
  createPump: async (data: CreatePumpRequest): Promise<Pump> => {
    try {
      console.log('[PUMPS-API] Creating pump with data:', data);
      const response = await apiClient.post(API_CONFIG.endpoints.pumps.base, data);
      const payload = extractData<any>(response);
      return (payload.pump ?? payload) as Pump;
    } catch (error) {
      console.error('[PUMPS-API] Error creating pump:', error);
      throw error;
    }
  },
  
  /**
   * Update a pump
   * @param id Pump ID
   * @param data Pump data to update
   * @returns Updated pump
   */
  updatePump: async (id: string, data: UpdatePumpRequest): Promise<Pump> => {
    try {
      console.log(`[PUMPS-API] Updating pump ${id} with data:`, data);
      const response = await apiClient.put(`${API_CONFIG.endpoints.pumps.base}/${id}`, data);
      return extractData<Pump>(response);
    } catch (error) {
      console.error(`[PUMPS-API] Error updating pump ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete a pump
   * @param id Pump ID
   */
  deletePump: async (id: string): Promise<void> => {
    try {
      console.log(`[PUMPS-API] Deleting pump ${id}`);
      await apiClient.delete(`${API_CONFIG.endpoints.pumps.base}/${id}`);
      console.log(`[PUMPS-API] Successfully deleted pump ${id}`);
    } catch (error) {
      console.error(`[PUMPS-API] Error deleting pump ${id}:`, error);
      throw error;
    }
  }
};

export default pumpsService;