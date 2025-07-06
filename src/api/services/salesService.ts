/**
 * @file api/services/salesService.ts
 * @description Service for sales API endpoints
 */
import apiClient, { extractData, extractArray } from '../core/apiClient';

export interface Sale {
  id: string;
  nozzleId: string;
  stationId: string;
  stationName: string;
  pumpId: string;
  pumpName: string;
  nozzleNumber: number;
  fuelType: string;
  volume: number;
  fuelPrice: number;
  amount: number;
  paymentMethod: string;
  status?: string;
  recordedAt: string;
}

export interface SalesFilters {
  stationId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  page?: number;
}

export const salesService = {
  /**
   * Get sales list
   */
  getSales: async (filters: SalesFilters = {}): Promise<Sale[]> => {
    try {
      const params = new URLSearchParams();
      if (filters.stationId) params.append('stationId', filters.stationId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.page) params.append('page', filters.page.toString());

      const response = await apiClient.get(`/sales?${params.toString()}`);
      return extractArray<Sale>(response, 'sales');
    } catch (error) {
      console.error('[SALES-API] Error fetching sales:', error);
      throw error;
    }
  }
};