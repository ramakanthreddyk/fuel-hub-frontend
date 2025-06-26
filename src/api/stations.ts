
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
      const rawStations = ensureArray(response.data);
      return rawStations.map((station: any) => ({
        id: station.id,
        name: station.name,
        address: station.address,
        status: station.status,
        manager: station.manager,
        attendantCount: station.attendantCount || 0,
        pumpCount: station.pumpCount || 0,
        createdAt: station.createdAt || station.created_at,
        metrics: station.metrics
      }));
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
    const station = response.data;
    return {
      id: station.id,
      name: station.name,
      address: station.address,
      status: station.status,
      manager: station.manager,
      attendantCount: station.attendantCount || 0,
      pumpCount: station.pumpCount || 0,
      createdAt: station.createdAt || station.created_at,
      metrics: station.metrics
    };
  }
};
