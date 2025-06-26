
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
    
    // Response is already converted to camelCase by the interceptor
    return {
      id: reading.id,
      nozzleId: reading.nozzleId || readingData.nozzleId,
      reading: reading.reading || readingData.reading,
      recordedAt: reading.recordedAt || readingData.recordedAt,
      paymentMethod: reading.paymentMethod || readingData.paymentMethod,
      creditorId: reading.creditorId || readingData.creditorId,
      createdAt: reading.createdAt || new Date().toISOString()
    };
  },
  
  // Get latest reading for a nozzle
  getLatestReading: async (nozzleId: string): Promise<NozzleReading | null> => {
    try {
      const response = await apiClient.get(`/nozzle-readings?nozzleId=${nozzleId}`);
      const readings = response.data.readings || [];
      if (readings.length === 0) return null;
      
      const reading = readings[0];
      // Response is already converted to camelCase by the interceptor
      return {
        id: reading.id,
        nozzleId: reading.nozzleId,
        reading: parseFloat(reading.reading),
        recordedAt: reading.recordedAt,
        paymentMethod: reading.paymentMethod || 'cash',
        creditorId: reading.creditorId,
        createdAt: reading.createdAt
      };
    } catch (error) {
      return null;
    }
  }
};
