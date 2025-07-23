
/**
 * @file api/reconciliation.ts
 * @description Reconciliation API functions
 */
import { contractClient } from './contract-client';
import { apiClient } from './client';
import { ReconciliationRecord, ReconciliationSummary, CreateReconciliationRequest, DailyReadingSummary } from './api-contract';

/**
 * Get reconciliation records
 */
export const getReconciliationRecords = async (params: {
  stationId?: string;
  startDate?: string;
  endDate?: string;
}): Promise<ReconciliationRecord[]> => {
  return contractClient.get<ReconciliationRecord[]>('/reconciliation/records', params);
};

/**
 * Get reconciliation summary
 */
export const getReconciliationSummary = async (params: {
  stationId?: string;
  date?: string;
}): Promise<ReconciliationSummary> => {
  return contractClient.get<ReconciliationSummary>('/reconciliation/summary', params);
};

/**
 * Create reconciliation record
 */
export const createReconciliationRecord = async (data: {
  stationId: string;
  date: string;
  openingCash: number;
  closingCash: number;
  totalSales: number;
  cashSales: number;
  cardSales: number;
  expenses: number;
  notes?: string;
}): Promise<ReconciliationRecord> => {
  return contractClient.post<ReconciliationRecord>('/reconciliation/records', data);
};

/**
 * Update reconciliation record
 */
export const updateReconciliationRecord = async (
  id: string,
  data: Partial<ReconciliationRecord>
): Promise<ReconciliationRecord> => {
  return contractClient.put<ReconciliationRecord>(`/reconciliation/records/${id}`, data);
};

/**
 * Delete reconciliation record
 */
export const deleteReconciliationRecord = async (id: string): Promise<void> => {
  return contractClient.delete(`/reconciliation/records/${id}`);
};

/**
 * Get reconciliation analytics
 */
export const getReconciliationAnalytics = async (params: {
  stationId?: string;
  period?: string;
}) => {
  const records = await getReconciliationRecords(params);
  
  const analytics = {
    totalRecords: records.length,
    averageDiscrepancy: 0,
    largestDiscrepancy: 0,
    reconciliationRate: 0,
    trends: [] as any[]
  };

  if (records.length > 0) {
    const discrepancies = records.map(record => {
      const expected = record.total_sales || 0;
      const actual = record.variance || 0;
      return Math.abs(actual);
    });

    analytics.averageDiscrepancy = discrepancies.reduce((a, b) => a + b, 0) / discrepancies.length;
    analytics.largestDiscrepancy = Math.max(...discrepancies);
    analytics.reconciliationRate = (records.filter(r => {
      const variance = r.variance || 0;
      return Math.abs(variance) < 100; // Within 100 rupees tolerance
    }).length / records.length) * 100;
  }

  return analytics;
};

/**
 * Get daily reconciliation status
 */
export const getDailyReconciliationStatus = async (params: {
  stationId?: string;
  date?: string;
}) => {
  const records = await getReconciliationRecords(params);
  
  return records.map(record => ({
    id: record.id,
    stationId: record.stationId,
    date: record.date,
    status: record.status,
    discrepancy: record.variance || 0,
    totalSales: record.total_sales || 0,
    cashBalance: record.variance || 0,
    expenses: 0
  }));
};

/**
 * Reconciliation API object that combines all reconciliation functions
 */
export const reconciliationApi = {
  // Get daily readings summary for reconciliation
  getDailyReadingsSummary: async (stationId: string, date: string): Promise<DailyReadingSummary[]> => {
    try {
      if (!stationId || !date) {
        console.error('Error: stationId and date are required for daily readings summary');
        throw new Error('Station ID and date are required for daily readings summary');
      }
      
      // Ensure the date is properly formatted (YYYY-MM-DD)
      const formattedDate = new Date(date).toISOString().split('T')[0];
      
      const response = await apiClient.get(`/reconciliation/daily-summary?stationId=${stationId}&date=${formattedDate}`);
      return response.data.data || [];
    } catch (error: any) {
      console.error('Error fetching daily readings summary:', error);
      // If it's a 404 error, return an empty array instead of throwing
      if (error.response && error.response.status === 404) {
        console.log('No reconciliation found, returning empty array');
        return [];
      }
      throw new Error(`Failed to fetch sales data: ${error.message || 'Unknown error'}`);
    }
  },

  // Create new reconciliation record
  createReconciliation: async (data: CreateReconciliationRequest): Promise<ReconciliationRecord> => {
    try {
      // First check if reconciliation already exists
      try {
        const existingRec = await reconciliationApi.getReconciliationByStationAndDate(data.stationId, data.date);
        if (existingRec) {
          console.log('Reconciliation already exists:', existingRec);
          return existingRec; // Return the existing reconciliation instead of creating a new one
        }
      } catch (err) {
        // If error is not 404 (not found), rethrow it
        if (err.response && err.response.status !== 404) {
          throw err;
        }
        // Otherwise, continue with creating a new reconciliation
      }
      
      const response = await apiClient.post('/reconciliation', data);
      return response.data.data;
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
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching reconciliation history:', error);
      return [];
    }
  },

  // Get reconciliation by ID
  getReconciliationById: async (id: string): Promise<ReconciliationRecord> => {
    const response = await apiClient.get(`/reconciliation/${id}`);
    return response.data.data;
  },

  // Get reconciliation by station and date
  getReconciliationByStationAndDate: async (stationId: string, date: string): Promise<ReconciliationRecord | null> => {
    try {
      const response = await apiClient.get(`/reconciliation/${stationId}/${date}`);
      return response.data.data;
    } catch (error: any) {
      // If it's a 404 error, return null instead of throwing
      if (error.response && error.response.status === 404) {
        console.log('Found existing reconciliation: undefined');
        return null;
      }
      throw error;
    }
  },

  // Approve reconciliation
  approveReconciliation: async (id: string): Promise<ReconciliationRecord> => {
    const response = await apiClient.post(`/reconciliation/${id}/approve`);
    return response.data.data;
  },
  
  // Add the existing functions
  getReconciliationRecords,
  getReconciliationSummary,
  createReconciliationRecord,
  updateReconciliationRecord,
  deleteReconciliationRecord,
  getReconciliationAnalytics,
  getDailyReconciliationStatus
};
