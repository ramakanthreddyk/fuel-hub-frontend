
/**
 * @file nozzlesService.ts
 * @description Service for nozzles API endpoints
 */
import apiClient, { extractData, extractArray } from '../core/apiClient';
import API_CONFIG from '../core/config';

export interface Nozzle {
  id: string;
  pumpId: string;
  nozzleNumber: number;
  fuelType: 'petrol' | 'diesel' | 'premium';
  status: 'active' | 'inactive' | 'maintenance';
  lastReading?: number;
  createdAt: string;
}

export interface CreateNozzleRequest {
  pumpId: string;
  nozzleNumber: number;
  fuelType: 'petrol' | 'diesel' | 'premium';
  status?: 'active' | 'inactive' | 'maintenance';
}

import { readingsService } from './readingsService';

export const nozzlesService = {
  getNozzles: async (pumpId?: string): Promise<Nozzle[]> => {
    const params = pumpId ? `?pumpId=${pumpId}` : '';
    const response = await apiClient.get(`${API_CONFIG.endpoints.nozzles.base}${params}`);
    const nozzles = extractArray<Nozzle>(response, 'nozzles');
    return nozzles;
  },
  
  /**
   * Get nozzles with their latest readings
   * This method fetches nozzles and then enriches them with their latest readings
   */
  getNozzlesWithReadings: async (pumpId?: string): Promise<Nozzle[]> => {
    try {
      // First get all nozzles
      const nozzles = await nozzlesService.getNozzles(pumpId);
      
      // Then fetch the latest reading for each nozzle
      const nozzlesWithReadings = await Promise.all(
        nozzles.map(async (nozzle) => {
          try {
            const latestReading = await readingsService.getLatestReading(nozzle.id);
            return {
              ...nozzle,
              lastReading: latestReading?.reading
            };
          } catch (error) {
            console.warn(`Failed to get latest reading for nozzle ${nozzle.id}:`, error);
            return nozzle;
          }
        })
      );
      
      return nozzlesWithReadings;
    } catch (error) {
      console.error('Failed to get nozzles with readings:', error);
      throw error;
    }
  },

  getNozzle: async (id: string): Promise<Nozzle> => {
    const response = await apiClient.get(API_CONFIG.endpoints.nozzles.byId(id));
    return extractData<Nozzle>(response);
  },

  createNozzle: async (data: CreateNozzleRequest): Promise<Nozzle> => {
    const response = await apiClient.post(API_CONFIG.endpoints.nozzles.base, data);
    return extractData<Nozzle>(response);
  },

  updateNozzle: async (id: string, data: Partial<CreateNozzleRequest>): Promise<Nozzle> => {
    const response = await apiClient.put(API_CONFIG.endpoints.nozzles.byId(id), data);
    return extractData<Nozzle>(response);
  },

  deleteNozzle: async (id: string): Promise<void> => {
    await apiClient.delete(API_CONFIG.endpoints.nozzles.byId(id));
  }
};

export default nozzlesService;
