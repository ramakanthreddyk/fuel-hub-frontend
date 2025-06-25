import { apiClient } from './client';
import { ensureArray } from '@/utils/apiHelpers';

export interface Pump {
  id: string;
  stationId: string;
  label: string;
  serialNumber?: string;
  status: 'active' | 'inactive' | 'maintenance';
  nozzleCount: number;
  createdAt: string;
}

export const pumpsApi = {
  // Get pumps for a station
  getPumps: async (stationId: string): Promise<Pump[]> => {
    try {
      const response = await apiClient.get(`/pumps?stationId=${stationId}`);
      return ensureArray<Pump>(response.data.pumps || response.data);
    } catch (error) {
      console.error('Error fetching pumps:', error);
      return [];
    }
  },
  
  // Create new pump
  createPump: async (data: { stationId: string; label: string; serialNumber?: string }): Promise<Pump> => {
    const response = await apiClient.post('/pumps', data);
    return response.data;
  },
  
  // Delete pump
  deletePump: async (pumpId: string): Promise<void> => {
    await apiClient.delete(`/pumps/${pumpId}`);
  }
};
