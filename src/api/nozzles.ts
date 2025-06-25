
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
      const rawNozzles = ensureArray(response.data.nozzles || response.data);
      // Convert snake_case to camelCase
      return rawNozzles.map((nozzle: any) => ({
        id: nozzle.id,
        pumpId: nozzle.pump_id,
        nozzleNumber: nozzle.nozzle_number,
        fuelType: nozzle.fuel_type,
        status: nozzle.status,
        createdAt: nozzle.created_at
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
      return {
        id: nozzle.id,
        pumpId: nozzle.pump_id,
        nozzleNumber: nozzle.nozzle_number,
        fuelType: nozzle.fuel_type,
        status: nozzle.status,
        createdAt: nozzle.created_at
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
    return {
      id: nozzle.id,
      pumpId: nozzle.pump_id || data.pumpId,
      nozzleNumber: nozzle.nozzle_number || data.nozzleNumber,
      fuelType: nozzle.fuel_type || data.fuelType,
      status: nozzle.status || 'active',
      createdAt: nozzle.created_at || new Date().toISOString()
    };
  },
  
  // Update nozzle
  updateNozzle: async (nozzleId: string, data: UpdateNozzleRequest): Promise<Nozzle> => {
    const response = await apiClient.put(`/nozzles/${nozzleId}`, data);
    const nozzle = response.data;
    return {
      id: nozzle.id || nozzleId,
      pumpId: nozzle.pump_id,
      nozzleNumber: nozzle.nozzle_number,
      fuelType: nozzle.fuel_type || data.fuelType,
      status: nozzle.status || data.status,
      createdAt: nozzle.created_at
    };
  },
  
  // Delete nozzle
  deleteNozzle: async (nozzleId: string): Promise<void> => {
    await apiClient.delete(`/nozzles/${nozzleId}`);
  }
};
