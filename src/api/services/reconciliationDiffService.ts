/**
 * @file api/services/reconciliationDiffService.ts
 * @description Service for reconciliation differences API endpoints
 */
import apiClient, { extractData, extractArray } from '../core/apiClient';

export interface ReconciliationDiff {
  id: string;
  stationId: string;
  stationName?: string;
  date: string;
  reportedCash: number;
  actualCash: number;
  difference: number;
  status: 'match' | 'over' | 'short';
  cashReportId?: string;
  reconciliationId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReconciliationDiffFilters {
  stationId?: string;
  startDate?: string;
  endDate?: string;
  status?: 'match' | 'over' | 'short';
}

export interface DiscrepancySummary {
  totalDiscrepancies: number;
  totalOverReported: number;
  totalUnderReported: number;
  largestDiscrepancy: number;
  recentDiscrepancies: ReconciliationDiff[];
}

export const reconciliationDiffService = {
  /**
   * Get reconciliation differences
   */
  getReconciliationDiffs: async (filters: ReconciliationDiffFilters = {}): Promise<ReconciliationDiff[]> => {
    try {
      const params = new URLSearchParams();
      if (filters.stationId) params.append('stationId', filters.stationId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.status) params.append('status', filters.status);

      const response = await apiClient.get(`/reconciliation/differences?${params.toString()}`);
      return extractArray<ReconciliationDiff>(response);
    } catch (error) {
      console.error('[RECONCILIATION-DIFF-API] Error fetching differences:', error);
      throw error;
    }
  },

  /**
   * Get discrepancy summary for dashboard
   */
  getDiscrepancySummary: async (): Promise<DiscrepancySummary> => {
    try {
      const response = await apiClient.get('/reconciliation/differences/summary');
      return extractData<DiscrepancySummary>(response);
    } catch (error) {
      console.error('[RECONCILIATION-DIFF-API] Error fetching summary:', error);
      throw error;
    }
  },

  /**
   * Get reconciliation difference by ID
   */
  getReconciliationDiffById: async (id: string): Promise<ReconciliationDiff> => {
    try {
      const response = await apiClient.get(`/reconciliation/differences/${id}`);
      return extractData<ReconciliationDiff>(response);
    } catch (error) {
      console.error('[RECONCILIATION-DIFF-API] Error fetching difference:', error);
      throw error;
    }
  }
};