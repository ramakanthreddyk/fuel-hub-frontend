
import { apiClient } from './client';

export interface NozzleReading {
  id: string;
  nozzleId: string;
  reading: number;
  recordedAt: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
  creditorId?: string;
  createdAt: string;
}

export interface CreateReadingRequest {
  nozzleId: string;
  reading: number;
  recordedAt: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
  creditorId?: string;
}

export const readingsApi = {
  // Create new reading
  createReading: async (readingData: CreateReadingRequest): Promise<NozzleReading> => {
    const response = await apiClient.post('/nozzle-readings', readingData);
    return response.data;
  },
  
  // Get latest reading for a nozzle
  getLatestReading: async (nozzleId: string): Promise<NozzleReading | null> => {
    try {
      const response = await apiClient.get(`/nozzle-readings?nozzleId=${nozzleId}&limit=1`);
      return response.data[0] || null;
    } catch (error) {
      return null;
    }
  }
};
