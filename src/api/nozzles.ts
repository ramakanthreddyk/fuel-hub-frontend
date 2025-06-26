
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

export interface CreateNozzleRequest {
  pumpId: string;
  nozzleNumber: number;
  fuelType: 'petrol' | 'diesel' | 'premium';
}

export interface UpdateNozzleRequest {
  fuelType?: 'petrol' | 'diesel' | 'premium';
  status?: 'active' | 'inactive' | 'maintenance';
}

export const nozzlesApi = {
  // Get nozzles for a pump
  getNozzles: async (pumpId: string): Promise<Nozzle[]> => {
    try {
      const response = await apiClient.get(`/nozzles?pumpId=${pumpId}`);
      
      // Response is already converted to camelCase by the interceptor
      const rawNozzles = ensureArray(response.data.nozzles || response.data);
      return rawNozzles.map((nozzle: any) => ({
        id: nozzle.id,
        pumpId: nozzle.pumpId,
        nozzleNumber: nozzle.nozzleNumber,
        fuelType: nozzle.fuelType,
        status: nozzle.status,
        createdAt: nozzle.createdAt
      }));
    } catch (error) {
      console.error('Error fetching nozzles:', error);
      return [];
    }
  },
  
  // Get single nozzle
  getNozzle: async (nozzleId: string): Promise<Nozzle | null> => {
    try {
      const response = await apiClient.get(`/nozzles/${nozzleId}`);
      const nozzle = response.data;
      
      // Response is already converted to camelCase by the interceptor
      return {
        id: nozzle.id,
        pumpId: nozzle.pumpId,
        nozzleNumber: nozzle.nozzleNumber,
        fuelType: nozzle.fuelType,
        status: nozzle.status,
        createdAt: nozzle.createdAt
      };
    } catch (error) {
      console.error('Error fetching nozzle:', error);
      return null;
    }
  },
  
  // Create new nozzle
  createNozzle: async (data: CreateNozzleRequest): Promise<Nozzle> => {
    const response = await apiClient.post('/nozzles', data);
    const nozzle = response.data;
    
    // Response is already converted to camelCase by the interceptor
    return {
      id: nozzle.id,
      pumpId: nozzle.pumpId || data.pumpId,
      nozzleNumber: nozzle.nozzleNumber || data.nozzleNumber,
      fuelType: nozzle.fuelType || data.fuelType,
      status: nozzle.status || 'active',
      createdAt: nozzle.createdAt || new Date().toISOString()
    };
  },
  
  // Update nozzle
  updateNozzle: async (nozzleId: string, data: UpdateNozzleRequest): Promise<Nozzle> => {
    const response = await apiClient.post(`/nozzles/${nozzleId}`, data);
    const nozzle = response.data;
    
    // Response is already converted to camelCase by the interceptor
    return {
      id: nozzle.id || nozzleId,
      pumpId: nozzle.pumpId,
      nozzleNumber: nozzle.nozzleNumber,
      fuelType: nozzle.fuelType || data.fuelType,
      status: nozzle.status || data.status,
      createdAt: nozzle.createdAt
    };
  },
  
  // Delete nozzle
  deleteNozzle: async (nozzleId: string): Promise<void> => {
    await apiClient.delete(`/nozzles/${nozzleId}`);
  }
};
