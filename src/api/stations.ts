
import { apiClient } from './client';

export interface Station {
  id: string;
  name: string;
  address: string;
  status: 'active' | 'inactive' | 'maintenance';
  manager?: string;
  attendantCount: number;
  pumpCount: number;
  createdAt: string;
}

export const stationsApi = {
  // Get all stations for current tenant
  getStations: async (): Promise<Station[]> => {
    const response = await apiClient.get('/stations');
    return response.data;
  },
  
  // Get station by ID
  getStation: async (stationId: string): Promise<Station> => {
    const response = await apiClient.get(`/stations/${stationId}`);
    return response.data;
  }
};
