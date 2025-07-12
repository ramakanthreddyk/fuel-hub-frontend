
import { apiClient, extractApiData, extractApiArray } from '../client';
import type { NozzleReading, ApiResponse } from '../api-contract';

export interface CreateReadingRequest {
  nozzleId: string;
  reading: number;
  recordedAt: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
  creditorId?: string;
}

export interface UpdateReadingRequest {
  reading?: number;
  recordedAt?: string;
  paymentMethod?: 'cash' | 'card' | 'upi' | 'credit';
  creditorId?: string;
}

export const readingsService = {
  getReadings: async (filters?: any): Promise<NozzleReading[]> => {
    try {
      const params = new URLSearchParams();
      if (filters?.stationId) params.append('stationId', filters.stationId);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);
      
      const response = await apiClient.get(`/nozzle-readings?${params.toString()}`);
      return extractApiArray<NozzleReading>(response, 'readings');
    } catch (error) {
      console.error('[READINGS] Error fetching readings:', error);
      return [];
    }
  },

  getReading: async (id: string): Promise<NozzleReading> => {
    try {
      const response = await apiClient.get(`/nozzle-readings/${id}`);
      return extractApiData<NozzleReading>(response);
    } catch (error) {
      console.error('[READINGS] Error fetching reading:', error);
      throw error;
    }
  },

  createReading: async (data: CreateReadingRequest): Promise<NozzleReading> => {
    try {
      console.log('[READINGS] Creating reading:', data);
      const response = await apiClient.post('/nozzle-readings', data);
      return extractApiData<NozzleReading>(response);
    } catch (error) {
      console.error('[READINGS] Error creating reading:', error);
      throw error;
    }
  },

  updateReading: async (id: string, data: UpdateReadingRequest): Promise<NozzleReading> => {
    try {
      console.log('[READINGS] Updating reading:', id, data);
      const response = await apiClient.patch(`/nozzle-readings/${id}`, data);
      return extractApiData<NozzleReading>(response);
    } catch (error) {
      console.error('[READINGS] Error updating reading:', error);
      throw error;
    }
  },

  deleteReading: async (id: string): Promise<void> => {
    try {
      console.log('[READINGS] Deleting reading:', id);
      await apiClient.delete(`/nozzle-readings/${id}`);
    } catch (error) {
      console.error('[READINGS] Error deleting reading:', error);
      throw error;
    }
  },

  getLatestReading: async (nozzleId: string): Promise<NozzleReading | null> => {
    try {
      const response = await apiClient.get(`/nozzle-readings?nozzleId=${nozzleId}&limit=1&sort=recordedAt:desc`);
      const readings = extractApiArray<NozzleReading>(response, 'readings');
      return readings.length > 0 ? readings[0] : null;
    } catch (error) {
      console.error('[READINGS] Error fetching latest reading:', error);
      return null;
    }
  },

  canCreateReading: async (nozzleId: string): Promise<{ canCreate: boolean; reason?: string; missingPrice?: boolean }> => {
    try {
      const response = await apiClient.get(`/nozzle-readings/can-create/${nozzleId}`);
      return extractApiData(response);
    } catch (error) {
      console.error('[READINGS] Error checking can create reading:', error);
      return { canCreate: true };
    }
  },
};
