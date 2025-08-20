// nozzleService.ts
// Unified business logic for nozzles
import { apiClient, extractApiData as extractData, extractApiArray as extractArray } from '@/api/client';
import API_CONFIG from '@/api/core/config';
import type { Nozzle } from '../../contract/models';
// Define CreateNozzleRequest locally if not in contract/models
export interface CreateNozzleRequest {
  pumpId: string;
  stationId: string;
  name: string;
  fuelType: 'petrol' | 'diesel' | 'premium';
}

export const nozzleService = {
  getNozzles: async (pumpId?: string): Promise<Nozzle[]> => {
    const params = pumpId ? `?pumpId=${pumpId}` : '';
    const response = await apiClient.get(`${API_CONFIG.endpoints.nozzles.base}${params}`);
    return extractArray<Nozzle>(response, 'nozzles');
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
  },
  getNozzleSettings: async (id: string): Promise<any> => {
    const response = await apiClient.get(API_CONFIG.endpoints.nozzles.settings(id));
    return extractData<any>(response);
  },
  updateNozzleSettings: async (id: string, data: any): Promise<any> => {
    const response = await apiClient.put(API_CONFIG.endpoints.nozzles.settings(id), data);
    return extractData<any>(response);
  }
};
