
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
      if (!stationId || !date) {
        console.error('Error: stationId and date are required for daily readings summary');
        return [];
      }
      
      const response = await apiClient.get(`/reconciliation/daily-summary?stationId=${stationId}&date=${date}`);
      const data = extractApiArray<DailyReadingSummary>(response, 'readings');
      
      // Normalize the data to ensure it has all required fields
      return data.map(item => ({
        ...item,
        nozzleId: item.nozzleId || '',
        nozzleNumber: item.nozzleNumber || 0,
        previousReading: item.previousReading || item.openingReading || 0,
        currentReading: item.currentReading || item.closingReading || 0,
        deltaVolume: item.deltaVolume || item.totalVolume || 0,
        pricePerLitre: item.pricePerLitre || 0,
        saleValue: item.saleValue || item.revenue || 0,
        fuelType: item.fuelType || 'Unknown',
        // Add aliases for compatibility
        openingReading: item.openingReading || item.previousReading || 0,
        closingReading: item.closingReading || item.currentReading || 0,
        totalVolume: item.totalVolume || item.deltaVolume || 0,
        revenue: item.revenue || item.saleValue || 0
      }));
    } catch (error) {
      console.error('Error fetching daily readings summary:', error);
      return [];
    }
  },

  // Create new reconciliation record
  createReconciliation: async (data: CreateReconciliationRequest): Promise<ReconciliationRecord> => {
    try {
      // Validate required fields
      if (!data.stationId) throw new Error('Station ID is required');
      if (!data.date) throw new Error('Date is required');
      
      const response = await apiClient.post('/reconciliation', data);
      const result = extractApiData<ReconciliationRecord>(response);
      
      // Ensure the result has all required fields
      return {
        ...result,
        id: result.id || '',
        stationId: result.stationId || data.stationId,
        date: result.date || data.date,
        openingReading: result.openingReading || 0,
        closingReading: result.closingReading || 0,
        variance: result.variance || 0,
        reconciliationNotes: result.reconciliationNotes || data.reconciliationNotes,
        managerConfirmation: result.managerConfirmation || data.managerConfirmation,
        createdAt: result.createdAt || new Date().toISOString()
      };
    } catch (error: any) {
      console.error('Error creating reconciliation:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to create reconciliation');
    }
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
