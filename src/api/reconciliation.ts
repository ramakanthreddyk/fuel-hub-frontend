
import { apiClient, extractApiData, extractApiArray } from './client';
import type { ReconciliationRecord, CreateReconciliationRequest, ApiResponse } from './api-contract';

export interface DailyReadingSummary {
  nozzleId: string;
  nozzleNumber: number;
  previousReading: number;
  currentReading: number;
  deltaVolume: number;
  pricePerLitre: number;
  saleValue: number;
  paymentMethod: string;
  cashDeclared: number;
  fuelType: string;
}

export const reconciliationApi = {
  // Get daily readings summary for reconciliation
  getDailyReadingsSummary: async (stationId: string, date: string): Promise<DailyReadingSummary[]> => {
    try {
      const response = await apiClient.get(`/reconciliation/daily-summary?stationId=${stationId}&date=${date}`);
      return extractApiArray<DailyReadingSummary>(response, 'readings');
    } catch (error) {
      console.error('Error fetching daily readings summary:', error);
      return [];
    }
  },

  // Create new reconciliation record
  createReconciliation: async (data: CreateReconciliationRequest): Promise<ReconciliationRecord> => {
    const response = await apiClient.post('/reconciliation', data);
    return extractApiData<ReconciliationRecord>(response);
  },

  // Get reconciliation history
  getReconciliationHistory: async (stationId?: string): Promise<ReconciliationRecord[]> => {
    try {
      const params = new URLSearchParams();
      if (stationId) params.append('stationId', stationId);
      
      const response = await apiClient.get(`/reconciliation?${params.toString()}`);
      return extractApiArray<ReconciliationRecord>(response, 'reconciliations');
    } catch (error) {
      console.error('Error fetching reconciliation history:', error);
      return [];
    }
  }
};

// Export types for backward compatibility
export type { ReconciliationRecord, CreateReconciliationRequest, DailyReadingSummary };
