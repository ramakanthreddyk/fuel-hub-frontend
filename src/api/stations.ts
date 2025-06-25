
import { apiClient } from './client';
import { ensureArray } from '@/utils/apiHelpers';

export interface Station {
  id: string;
  name: string;
  address?: string;
  status: 'active' | 'inactive' | 'maintenance';
  manager?: string;
  attendantCount: number;
  pumpCount: number;
  createdAt: string;
  metrics?: {
    totalSales: number;
    totalVolume: number;
    transactionCount: number;
  };
}

export const stationsApi = {
  // Get all stations for current tenant
  getStations: async (includeMetrics = false): Promise<Station[]> => {
    try {
      const params = includeMetrics ? '?includeMetrics=true' : '';
      const response = await apiClient.get(`/stations${params}`);
      return ensureArray<Station>(response.data);
    } catch (error) {
      console.error('Error fetching stations:', error);
      return [];
    }
  },
  
  // Create new station
  createStation: async (data: { name: string; address?: string }): Promise<Station> => {
    const response = await apiClient.post('/stations', data);
    return response.data;
  },
  
  // Get station by ID
  getStation: async (stationId: string): Promise<Station> => {
    const response = await apiClient.get(`/stations/${stationId}`);
    return response.data;
  }
};
