
import { apiClient } from './client';

export interface Pump {
  id: string;
  stationId: string;
  name: string;
  serialNumber: string;
  status: 'active' | 'inactive' | 'maintenance';
  createdAt: string;
  nozzleCount: number;
}

export interface CreatePumpRequest {
  stationId: string;
  name: string;
  serialNumber: string;
}

export const pumpsApi = {
  // Get pumps for a specific station
  getPumps: async (stationId: string): Promise<Pump[]> => {
    const response = await apiClient.get(`/pumps?stationId=${stationId}`);
    return response.data;
  },
  
  // Create new pump
  createPump: async (pumpData: CreatePumpRequest): Promise<Pump> => {
    const response = await apiClient.post('/pumps', pumpData);
    return response.data;
  },
  
  // Get pump by ID
  getPump: async (pumpId: string): Promise<Pump> => {
    const response = await apiClient.get(`/pumps/${pumpId}`);
    return response.data;
  }
};
