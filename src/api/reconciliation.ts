
import { apiClient, extractApiData, extractApiArray } from './client';
import type { 
  ReconciliationRecord, 
  CreateReconciliationRequest, 
  DailyReadingSummary,
  ApiResponse 
} from './api-contract';

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
  },

  // Get reconciliation by ID
  getReconciliationById: async (id: string): Promise<ReconciliationRecord> => {
    const response = await apiClient.get(`/reconciliation/${id}`);
    return extractApiData<ReconciliationRecord>(response);
  },

  // Get reconciliation by station and date
  getReconciliationByStationAndDate: async (stationId: string, date: string): Promise<ReconciliationRecord> => {
    const response = await apiClient.get(`/reconciliation/${stationId}/${date}`);
    return extractApiData<ReconciliationRecord>(response);
  },

  // Approve reconciliation
  approveReconciliation: async (id: string): Promise<ReconciliationRecord> => {
    const response = await apiClient.post(`/reconciliation/${id}/approve`);
    return extractApiData<ReconciliationRecord>(response);
  }
};
