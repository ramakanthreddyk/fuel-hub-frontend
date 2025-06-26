
import { apiClient, extractApiData, extractApiArray } from './client';
import type { Nozzle, CreateNozzleRequest, UpdateNozzleRequest, ApiResponse } from './api-contract';

export const nozzlesApi = {
  // Get nozzles for a pump
  getNozzles: async (pumpId: string): Promise<Nozzle[]> => {
    try {
      const response = await apiClient.get(`/nozzles?pumpId=${pumpId}`);
      return extractApiArray<Nozzle>(response, 'nozzles');
    } catch (error) {
      console.error('Error fetching nozzles:', error);
      return [];
    }
  },
  
  // Get single nozzle
  getNozzle: async (nozzleId: string): Promise<Nozzle | null> => {
    try {
      const response = await apiClient.get(`/nozzles/${nozzleId}`);
      return extractApiData<Nozzle>(response);
    } catch (error) {
      console.error('Error fetching nozzle:', error);
      return null;
    }
  },
  
  // Create new nozzle
  createNozzle: async (data: CreateNozzleRequest): Promise<Nozzle> => {
    const response = await apiClient.post('/nozzles', data);
    return extractApiData<Nozzle>(response);
  },
  
  // Update nozzle
  updateNozzle: async (nozzleId: string, data: UpdateNozzleRequest): Promise<Nozzle> => {
    const response = await apiClient.put(`/nozzles/${nozzleId}`, data);
    return extractApiData<Nozzle>(response);
  },
  
  // Delete nozzle
  deleteNozzle: async (nozzleId: string): Promise<void> => {
    await apiClient.delete(`/nozzles/${nozzleId}`);
  }
};

// Export types for backward compatibility
export type { Nozzle, CreateNozzleRequest, UpdateNozzleRequest };
