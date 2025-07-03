/**
 * @file api/services/attendantService.ts
 * @description Service for attendant-specific API endpoints
 */
import apiClient, { extractData, extractArray } from '../core/apiClient';

// Types
export interface CreditEntry {
  creditorId: string;
  fuelType: 'petrol' | 'diesel';
  litres?: number;
  amount?: number;
}

export interface CashReport {
  id?: string;
  stationId: string;
  date: string;
  cashAmount: number;
  creditEntries: CreditEntry[];
  status?: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Service for attendant API
 */
export const attendantService = {
  /**
   * Submit daily cash report
   * @param report Cash report data
   * @returns Created cash report
   */
  submitCashReport: async (report: CashReport): Promise<CashReport> => {
    try {
      console.log('[ATTENDANT-API] Submitting cash report:', report);
      const response = await apiClient.post('attendant/cash-report', report);
      return extractData<CashReport>(response);
    } catch (error) {
      console.error('[ATTENDANT-API] Error submitting cash report:', error);
      throw error;
    }
  },
  
  /**
   * Get cash reports
   * @returns List of cash reports
   */
  getCashReports: async (): Promise<CashReport[]> => {
    try {
      console.log('[ATTENDANT-API] Fetching cash reports');
      
      // No parameters as per API spec
      const response = await apiClient.get('attendant/cash-reports');
      return extractArray<CashReport>(response);
    } catch (error) {
      console.error('[ATTENDANT-API] Error fetching cash reports:', error);
      return [];
    }
  }
};

export default attendantService;
