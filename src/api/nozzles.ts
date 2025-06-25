import { apiClient } from './client';
import { ensureArray } from '@/utils/apiHelpers';

export interface Nozzle {
  id: string;
  pumpId: string;
  nozzleNumber: number;
  fuelType: 'petrol' | 'diesel' | 'premium';
  status: 'active' | 'inactive' | 'maintenance';
  createdAt: string;
}

export const nozzlesApi = {
  // Get nozzles for a pump
  getNozzles: async (pumpId: string): Promise<Nozzle[]> => {
    try {
      const response = await apiClient.get(`/nozzles?pumpId=${pumpId}`);
      return ensureArray<Nozzle>(response.data.nozzles || response.data);
    } catch (error) {
      console.error('Error fetching nozzles:', error);
      return [];
    }
  },
  
  // Create new nozzle
  createNozzle: async (data: { pumpId: string; nozzleNumber: number; fuelType: string }): Promise<Nozzle> => {
    const response = await apiClient.post('/nozzles', data);
    return response.data;
  },
  
  // Delete nozzle
  deleteNozzle: async (nozzleId: string): Promise<void> => {
    await apiClient.delete(`/nozzles/${nozzleId}`);
  }
};
