
/**
 * @file api/services/readingsService.ts
 * @description Readings service with proper type definitions
 */
import apiClient from '@/api/core/apiClient';

export interface Reading {
  id: string;
  nozzleId: string;
  nozzleNumber?: number;
  pumpName?: string;
  stationName?: string;
  reading: number;
  previousReading?: number;
  volume?: number;
  recordedAt: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
  creditorId?: string;
  creditorName?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  // Calculated fields
  amount?: number;
  pricePerLitre?: number;
  fuelType?: string;
  stationId?: string;
  pumpId?: string;
  attendantId?: string;
  attendantName?: string;
  recordedBy?: string;
}

export interface CreateReadingRequest {
  nozzleId: string;
  reading: number;
  recordedAt?: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
  creditorId?: string;
  notes?: string;
}

export interface UpdateReadingRequest {
  reading?: number;
  recordedAt?: string;
  paymentMethod?: 'cash' | 'card' | 'upi' | 'credit';
  creditorId?: string;
  notes?: string;
}

export const readingsService = {
  async getReadings(): Promise<Reading[]> {
    const response = await apiClient.get('/nozzle-readings');
    // Handle different response formats
    const data = response.data;
    if (Array.isArray(data)) {
      return data;
    }
    if (data && Array.isArray(data.readings)) {
      return data.readings;
    }
    if (data && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  },

  async getReading(id: string): Promise<Reading> {
    const response = await apiClient.get(`/nozzle-readings/${id}`);
    return response.data;
  },

  async createReading(data: CreateReadingRequest): Promise<Reading> {
    const response = await apiClient.post('/nozzle-readings', data);
    return response.data;
  },

  async updateReading(id: string, data: UpdateReadingRequest): Promise<Reading> {
    const response = await apiClient.put(`/nozzle-readings/${id}`, data);
    return response.data;
  },

  async getLatestReading(nozzleId: string): Promise<Reading | null> {
    try {
      const response = await apiClient.get(`/nozzle-readings/latest/${nozzleId}`);
      return response.data;
    } catch (error) {
      console.warn('Failed to get latest reading:', error);
      return null;
    }
  },

  async canCreateReading(nozzleId: string): Promise<{ canCreate: boolean; reason?: string; missingPrice?: boolean }> {
    try {
      const response = await apiClient.get(`/nozzle-readings/can-create/${nozzleId}`);
      return response.data;
    } catch (error) {
      console.warn('Failed to check reading creation:', error);
      return { canCreate: false, reason: 'Unable to verify reading requirements' };
    }
  }
};
