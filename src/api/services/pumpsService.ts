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
  serialNumber?: string;
  status: 'active' | 'inactive' | 'maintenance';
  createdAt: string;
  updatedAt?: string;
  nozzleCount: number;
}

export interface CreatePumpRequest {
  stationId: string;
  name: string;
  serialNumber?: string;
  status?: 'active' | 'inactive' | 'maintenance';
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
   * Get all pumps or pumps for a specific station
   */
  getPumps: async (stationId?: string): Promise<Pump[]> => {
    try {
      console.log(`[PUMPS-API] Fetching pumps${stationId ? ` for station: ${stationId}` : ''}`);
      
      const params = stationId ? { stationId } : {};
      const response = await apiClient.get('/pumps', { params });
      const pumps = extractArray<Pump>(response, 'pumps');
      console.log(`[PUMPS-API] Successfully fetched ${pumps.length} pumps`);
      return pumps;
    } catch (error) {
      console.error('[PUMPS-API] Error fetching pumps:', error);
      throw error;
    }
  },
  
  /**
   * Get a pump by ID
   */
  getPump: async (id: string): Promise<Pump> => {
    try {
      console.log(`[PUMPS-API] Fetching pump details for ID: ${id}`);
      const response = await apiClient.get(`/pumps/${id}`);
      return extractData<Pump>(response);
    } catch (error) {
      console.error(`[PUMPS-API] Error fetching pump ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Create a new pump
   */
  createPump: async (data: CreatePumpRequest): Promise<Pump> => {
    try {
      console.log('[PUMPS-API] Creating pump with data:', data);
      const response = await apiClient.post('/pumps', data);
      return extractData<Pump>(response);
    } catch (error) {
      console.error('[PUMPS-API] Error creating pump:', error);
      throw error;
    }
  },
  
  /**
   * Update a pump
   */
  updatePump: async (id: string, data: UpdatePumpRequest): Promise<Pump> => {
    try {
      console.log(`[PUMPS-API] Updating pump ${id} with data:`, data);
      const response = await apiClient.put(`/pumps/${id}`, data);
      return extractData<Pump>(response);
    } catch (error) {
      console.error(`[PUMPS-API] Error updating pump ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete a pump
   */
  deletePump: async (id: string): Promise<void> => {
    try {
      console.log(`[PUMPS-API] Deleting pump ${id}`);
      await apiClient.delete(`/pumps/${id}`);
      console.log(`[PUMPS-API] Successfully deleted pump ${id}`);
    } catch (error) {
      console.error(`[PUMPS-API] Error deleting pump ${id}:`, error);
      throw error;
    }
  }
};

export default pumpsService;
