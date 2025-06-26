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
      const rawPumps = ensureArray(response.data.pumps || response.data);
      // Convert snake_case to camelCase
      return rawPumps.map((pump: any) => ({
        id: pump.id,
        stationId: pump.station_id,
        label: pump.label,
        serialNumber: pump.serial_number,
        status: pump.status,
        nozzleCount: pump.nozzleCount,
        createdAt: pump.created_at
      }));
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
  
  // Get single pump
  getPump: async (pumpId: string): Promise<Pump> => {
    const response = await apiClient.get(`/pumps/${pumpId}`);
    const pump = response.data;
    // Convert snake_case to camelCase
    return {
      id: pump.id,
      stationId: pump.station_id,
      label: pump.label,
      serialNumber: pump.serial_number,
      status: pump.status,
      nozzleCount: pump.nozzleCount,
      createdAt: pump.created_at
    };
  },
  
  // Delete pump
  deletePump: async (pumpId: string): Promise<void> => {
    await apiClient.delete(`/pumps/${pumpId}`);
  }
};
