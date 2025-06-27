
import { apiClient, extractApiData, extractApiArray } from './client';
import type { Nozzle, CreateNozzleRequest, UpdateNozzleRequest, ApiResponse } from './api-contract';

const devLog = (message: string, ...args: any[]) => {
  if (import.meta.env.DEV) {
    console.log(`[NOZZLES-API] ${message}`, ...args);
  }
};

// Helper function to transform backend nozzle data to frontend format
const transformNozzle = (backendNozzle: any): Nozzle => {
  return {
    id: backendNozzle.id,
    pumpId: backendNozzle.pump_id,
    nozzleNumber: backendNozzle.nozzle_number, // Map snake_case to camelCase
    fuelType: backendNozzle.fuel_type,
    status: backendNozzle.status,
    createdAt: backendNozzle.created_at,
    updatedAt: backendNozzle.updated_at,
    tenantId: backendNozzle.tenant_id
  };
};

export const nozzlesApi = {
  getNozzles: async (pumpId: string): Promise<Nozzle[]> => {
    devLog('Fetching nozzles for pump:', pumpId);
    const response = await apiClient.get(`/nozzles?pumpId=${pumpId}`);
    const rawNozzles = extractApiArray<any>(response, 'nozzles');
    
    // Transform backend data to frontend format
    const transformedNozzles = rawNozzles.map(transformNozzle);
    devLog('Transformed nozzles:', transformedNozzles);
    
    return transformedNozzles;
  },

  getNozzle: async (id: string): Promise<Nozzle> => {
    devLog('Fetching nozzle:', id);
    const response = await apiClient.get(`/nozzles/${id}`);
    const rawNozzle = extractApiData<any>(response);
    return transformNozzle(rawNozzle);
  },

  createNozzle: async (nozzleData: CreateNozzleRequest): Promise<Nozzle> => {
    devLog('Creating nozzle:', nozzleData);
    const response = await apiClient.post('/nozzles', nozzleData);
    const rawNozzle = extractApiData<any>(response);
    return transformNozzle(rawNozzle);
  },

  updateNozzle: async (id: string, nozzleData: UpdateNozzleRequest): Promise<Nozzle> => {
    devLog('Updating nozzle:', id, nozzleData);
    const response = await apiClient.put(`/nozzles/${id}`, nozzleData);
    const rawNozzle = extractApiData<any>(response);
    return transformNozzle(rawNozzle);
  },

  deleteNozzle: async (id: string): Promise<void> => {
    devLog('Deleting nozzle:', id);
    await apiClient.delete(`/nozzles/${id}`);
  }
};

export type { Nozzle, CreateNozzleRequest, UpdateNozzleRequest };
