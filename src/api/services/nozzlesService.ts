
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

export const nozzlesService = {
  getNozzles: async (pumpId?: string): Promise<Nozzle[]> => {
    const params = pumpId ? `?pumpId=${pumpId}` : '';
    const response = await apiClient.get(`${API_CONFIG.endpoints.nozzles.base}${params}`);
    const nozzles = extractArray<Nozzle>(response, 'nozzles');
    return nozzles;
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
