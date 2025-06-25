
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
    const reading = response.data;
    return {
      id: reading.id,
      nozzleId: reading.nozzle_id || readingData.nozzleId,
      reading: reading.reading || readingData.reading,
      recordedAt: reading.recorded_at || readingData.recordedAt,
      paymentMethod: reading.payment_method || readingData.paymentMethod,
      creditorId: reading.creditor_id || readingData.creditorId,
      createdAt: reading.created_at || new Date().toISOString()
    };
  },
  
  // Get latest reading for a nozzle
  getLatestReading: async (nozzleId: string): Promise<NozzleReading | null> => {
    try {
      const response = await apiClient.get(`/nozzle-readings?nozzleId=${nozzleId}&limit=1`);
      const reading = response.data[0] || response.data.readings?.[0];
      if (!reading) return null;
      
      return {
        id: reading.id,
        nozzleId: reading.nozzle_id,
        reading: reading.reading,
        recordedAt: reading.recorded_at,
        paymentMethod: reading.payment_method,
        creditorId: reading.creditor_id,
        createdAt: reading.created_at
      };
    } catch (error) {
      return null;
    }
  }
};
