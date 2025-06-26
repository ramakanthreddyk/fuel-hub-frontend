
import { apiClient, extractApiData, extractApiArray } from './client';
import type { Pump, CreatePumpRequest, ApiResponse } from './api-contract';

export const pumpsApi = {
  // Get pumps for a station
  getPumps: async (stationId: string): Promise<Pump[]> => {
    try {
      const response = await apiClient.get(`/pumps?stationId=${stationId}`);
      return extractApiArray<Pump>(response, 'pumps');
    } catch (error) {
      console.error('Error fetching pumps:', error);
      return [];
    }
  },
  
  // Create new pump
  createPump: async (data: CreatePumpRequest): Promise<Pump> => {
    const response = await apiClient.post('/pumps', data);
    return extractApiData<Pump>(response);
  },
  
  // Get single pump
  getPump: async (pumpId: string): Promise<Pump> => {
    const response = await apiClient.get(`/pumps/${pumpId}`);
    return extractApiData<Pump>(response);
  },
  
  // Delete pump
  deletePump: async (pumpId: string): Promise<void> => {
    await apiClient.delete(`/pumps/${pumpId}`);
  }
};

// Export types for backward compatibility
export type { Pump, CreatePumpRequest };
