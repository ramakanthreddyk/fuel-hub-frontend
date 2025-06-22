
import { apiClient } from './client';

export interface Nozzle {
  id: string;
  pumpId: string;
  nozzleNumber: number;
  fuelType: 'petrol' | 'diesel' | 'premium';
  status: 'active' | 'inactive' | 'maintenance';
  createdAt: string;
}

export interface CreateNozzleRequest {
  pumpId: string;
  nozzleNumber: number;
  fuelType: 'petrol' | 'diesel' | 'premium';
}

export const nozzlesApi = {
  // Get nozzles for a specific pump
  getNozzles: async (pumpId: string): Promise<Nozzle[]> => {
    const response = await apiClient.get(`/nozzles?pumpId=${pumpId}`);
    return response.data;
  },
  
  // Create new nozzle
  createNozzle: async (nozzleData: CreateNozzleRequest): Promise<Nozzle> => {
    const response = await apiClient.post('/nozzles', nozzleData);
    return response.data;
  }
};
