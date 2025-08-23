/**
 * @file api/services/pumpsService.ts
 * @description Service for pumps API endpoints
 */
import apiClient, { extractData, extractArray } from '../core/apiClient';
import { secureLog, sanitizeUrlParam } from '@/utils/security';

// Types
export type PumpStatus = 'active' | 'inactive' | 'maintenance';

export interface Pump {
  id: string;
  stationId: string;
  name: string;
  serialNumber?: string;
  status: PumpStatus;
  createdAt: string;
  updatedAt?: string;
  nozzleCount: number;
}

export interface CreatePumpRequest {
  stationId: string;
  name: string;
  serialNumber?: string;
  status?: PumpStatus;
}

export interface UpdatePumpRequest {
  name?: string;
  serialNumber?: string;
  status?: PumpStatus;
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
      secureLog.debug('[PUMPS-API] Fetching pumps', stationId ? 'for station' : 'all', stationId);
      
      const params = stationId ? { stationId: sanitizeUrlParam(stationId) } : {};
      const response = await apiClient.get('/pumps', { params });
      const pumps = extractArray<Pump>(response, 'pumps');
      secureLog.debug('[PUMPS-API] Successfully fetched pumps', pumps.length);
      return pumps;
    } catch (error) {
      secureLog.error('[PUMPS-API] Error fetching pumps:', error);
      throw error;
    }
  },
  
  /**
   * Get a pump by ID
   */
  getPump: async (id: string): Promise<Pump> => {
    try {
      secureLog.debug('[PUMPS-API] Fetching pump details for ID:', id);
      const response = await apiClient.get(`/pumps/${sanitizeUrlParam(id)}`);
      return extractData<Pump>(response);
    } catch (error) {
      secureLog.error('[PUMPS-API] Error fetching pump:', id, error);
      throw error;
    }
  },
  
  /**
   * Create a new pump
   */
  createPump: async (data: CreatePumpRequest): Promise<Pump> => {
    try {
      secureLog.debug('[PUMPS-API] Creating pump with data:', data);
      const response = await apiClient.post('/pumps', data);
      return extractData<Pump>(response);
    } catch (error) {
      secureLog.error('[PUMPS-API] Error creating pump:', error);
      throw error;
    }
  },
  
  /**
   * Update a pump
   */
  updatePump: async (id: string, data: UpdatePumpRequest): Promise<Pump> => {
    try {
      secureLog.debug('[PUMPS-API] Updating pump with data:', id, data);
      const response = await apiClient.put(`/pumps/${sanitizeUrlParam(id)}`, data);
      return extractData<Pump>(response);
    } catch (error) {
      secureLog.error('[PUMPS-API] Error updating pump:', id, error);
      throw error;
    }
  },
  
  /**
   * Delete a pump
   */
  deletePump: async (id: string): Promise<void> => {
    try {
      secureLog.debug('[PUMPS-API] Deleting pump:', id);
      await apiClient.delete(`/pumps/${sanitizeUrlParam(id)}`);
      secureLog.debug('[PUMPS-API] Successfully deleted pump:', id);
    } catch (error) {
      secureLog.error('[PUMPS-API] Error deleting pump:', id, error);
      throw error;
    }
  }
};

export default pumpsService;
