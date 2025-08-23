import { apiClient, extractApiData, extractApiArray } from './client';
import type { Pump, CreatePumpRequest, ApiResponse } from './api-contract';
import { sanitizeUrlParam, secureLog } from '@/utils/security';

export const pumpsApi = {
  // Get pumps for a station
  getPumps: async (stationId: string): Promise<Pump[]> => {
    try {
      secureLog.debug('[PUMPS-API] Fetching pumps for station');
      
      // Use the correct API endpoint according to the API spec
      const url = stationId === 'all' ? '/pumps' : `/pumps?stationId=${sanitizeUrlParam(stationId)}`;
      
      secureLog.debug('[PUMPS-API] Making request to pumps endpoint');
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
      
      secureLog.debug(`[PUMPS-API] Successfully fetched ${pumps.length} pumps`);
      
      return pumps;
    } catch (error) {
      secureLog.error('[PUMPS-API] Error fetching pumps:', error);
      throw error; // Throw error to trigger React Query's retry mechanism
    }
  },
  
  // Create new pump
  createPump: async (data: CreatePumpRequest): Promise<Pump> => {
    try {
      secureLog.debug('[PUMPS-API] Creating pump with data');
      
      const response = await apiClient.post('/pumps', data);
      const payload = extractApiData<any>(response);
      const pump: Pump = payload.pump ?? payload;
      
      secureLog.debug('[PUMPS-API] Pump created successfully');
      return pump;
    } catch (error) {
      secureLog.error('[PUMPS-API] Error creating pump:', error);
      throw error;
    }
  },
  
  // Get single pump
  getPump: async (pumpId: string): Promise<Pump> => {
    try {
      secureLog.debug('[PUMPS-API] Fetching pump details');
      
      const response = await apiClient.get(`/pumps/${sanitizeUrlParam(pumpId)}`);
      const payload = extractApiData<any>(response);
      const pump: Pump = payload.pump ?? payload;
      
      secureLog.debug('[PUMPS-API] Pump details retrieved');
      return pump;
    } catch (error) {
      secureLog.error('[PUMPS-API] Error fetching pump:', error);
      throw error;
    }
  },
  
  // Delete pump
  deletePump: async (pumpId: string): Promise<void> => {
    try {
      secureLog.debug('[PUMPS-API] Deleting pump');
      
      await apiClient.delete(`/pumps/${sanitizeUrlParam(pumpId)}`);
      secureLog.debug('[PUMPS-API] Pump deleted successfully');
    } catch (error) {
      secureLog.error('[PUMPS-API] Error deleting pump:', error);
      throw error;
    }
  }
};

// Export types for backward compatibility
export type { Pump, CreatePumpRequest };
