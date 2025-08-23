/**
 * @file api/services/dailySales.service.ts
 * @description Service for daily sales API endpoints
 */
import apiClient, { extractData, extractArray } from '../core/apiClient';
import { secureLog } from '@/utils/security';

export const dailySalesService = {
  /**
   * Get daily sales
   */
  getDailySales: async (params: any = {}): Promise<any[]> => {
    try {
      const response = await apiClient.get('/reports/daily-sales', { params });
      return extractArray(response, 'sales');
    } catch (error) {
      secureLog.error('[DAILY-SALES-API] Error fetching daily sales:', error);
      return [];
    }
  },

  /**
   * Get daily sales summary
   */
  getDailySalesSummary: async (params: any = {}): Promise<any> => {
    try {
      const response = await apiClient.get('/reports/daily-sales/summary', { params });
      return extractData(response);
    } catch (error) {
      secureLog.error('[DAILY-SALES-API] Error fetching daily sales summary:', error);
      throw error;
    }
  }
};

export default dailySalesService;