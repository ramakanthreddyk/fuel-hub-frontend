/**
 * @file api/services/reconciliationDiffService.ts
 * @description Service for reconciliation differences API endpoints
 */
import apiClient, { extractData, extractArray } from '../core/apiClient';
import { secureLog, sanitizeUrlParam } from '@/utils/security';

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
      // Ensure we have at least one filter parameter
      if (!filters.stationId && !filters.startDate && !filters.endDate && !filters.status) {
        secureLog.error('[RECONCILIATION-DIFF-API] Missing required filter parameters');
        return [];
      }

      const params = new URLSearchParams();
      if (filters.stationId) params.append('stationId', sanitizeUrlParam(filters.stationId));
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.status) params.append('status', filters.status);

      const response = await apiClient.get(`/reconciliation/differences?${params.toString()}`);
      return extractArray<ReconciliationDiff>(response);
    } catch (error) {
      secureLog.error('[RECONCILIATION-DIFF-API] Error fetching differences:', error);
      // Return empty array instead of throwing to prevent UI errors
      return [];
    }
  },

  /**
   * Get discrepancy summary for dashboard
   * @param stationId - Station ID
   * @param date - Date in YYYY-MM-DD format
   */
  getDiscrepancySummary: async (stationId: string, date: string): Promise<DiscrepancySummary> => {
    try {
      if (!stationId || !date) {
        throw new Error('stationId and date required');
      }
      const response = await apiClient.get(`/reconciliation/differences/summary?stationId=${sanitizeUrlParam(stationId)}&date=${date}`);
      return extractData<DiscrepancySummary>(response);
    } catch (error) {
      secureLog.error('[RECONCILIATION-DIFF-API] Error fetching summary:', error);
      throw error;
    }
  },

  /**
   * Get reconciliation difference by ID
   */
  getReconciliationDiffById: async (id: string): Promise<ReconciliationDiff> => {
    try {
      const response = await apiClient.get(`/reconciliation/differences/${sanitizeUrlParam(id)}`);
      return extractData<ReconciliationDiff>(response);
    } catch (error) {
      secureLog.error('[RECONCILIATION-DIFF-API] Error fetching difference:', error);
      throw error;
    }
  }
};