
/**
 * @file api/reconciliation.ts
 * @description Reconciliation API functions
 */
import { contractClient } from './contract-client';
import { ReconciliationRecord, ReconciliationSummary } from './api-contract';

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
