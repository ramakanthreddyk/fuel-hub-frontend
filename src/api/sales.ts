
import { apiClient } from './client';

export interface Sale {
  id: string;
  nozzleId: string;
  stationId: string;
  volume: number;
  fuelType: 'petrol' | 'diesel' | 'premium';
  fuelPrice: number;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
  creditorId?: string;
  status: 'draft' | 'posted';
  recordedAt: string;
  createdAt: string;
  station?: {
    name: string;
  };
  nozzle?: {
    nozzleNumber: number;
    fuelType: string;
  };
}

export interface SalesFilters {
  stationId?: string;
  fromDate?: string;
  toDate?: string;
  paymentMethod?: string;
}

export const salesApi = {
  // Get sales with filters
  getSales: async (filters: SalesFilters = {}): Promise<Sale[]> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });
    
    const response = await apiClient.get(`/sales?${params.toString()}`);
    return response.data;
  }
};
