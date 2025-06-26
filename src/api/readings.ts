
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
      const response = await apiClient.get(`/nozzle-readings?nozzleId=${nozzleId}`);
      const readings = response.data.readings || [];
      if (readings.length === 0) return null;
      
      const reading = readings[0];
      return {
        id: reading.id,
        nozzleId: reading.nozzle_id,
        reading: parseFloat(reading.reading),
        recordedAt: reading.recorded_at,
        paymentMethod: reading.payment_method || 'cash',
        creditorId: reading.creditor_id,
        createdAt: reading.created_at
      };
    } catch (error) {
      return null;
    }
  }
};
