/**
 * @file api/services/reportsService.ts
 * @description Service for reports API endpoints
 */
import apiClient, { extractData, extractArray } from '../core/apiClient';

/**
 * Service for reports API
 */
export const reportsService = {
  /**
   * Export a report
   * @param data Export request data
   * @returns Export response
   */
  exportReport: async (data: any): Promise<any> => {
    try {
      console.log('[REPORTS-API] Exporting report:', data);
      const response = await apiClient.post('/reports/export', data);
      return extractData(response);
    } catch (error) {
      console.error('[REPORTS-API] Error exporting report:', error);
      throw error;
    }
  },

  /**
   * Schedule a report
   * @param data Schedule request data
   * @returns Schedule response
   */
  scheduleReport: async (data: any): Promise<any> => {
    try {
      console.log('[REPORTS-API] Scheduling report:', data);
      const response = await apiClient.post('/reports/schedule', data);
      return extractData(response);
    } catch (error) {
      console.error('[REPORTS-API] Error scheduling report:', error);
      throw error;
    }
  },

  /**
   * Get report history
   * @returns List of reports
   */
  getReportHistory: async (): Promise<any[]> => {
    try {
      console.log('[REPORTS-API] Fetching report history');
      const response = await apiClient.get('/reports/history');
      return extractArray(response, 'reports');
    } catch (error) {
      console.error('[REPORTS-API] Error fetching report history:', error);
      return [];
    }
  },

  /**
   * Download a report
   * @param reportId Report ID
   * @returns Report blob
   */
  downloadReport: async (reportId: string): Promise<Blob> => {
    try {
      console.log('[REPORTS-API] Downloading report:', reportId);
      const response = await apiClient.get(`/reports/download/${reportId}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('[REPORTS-API] Error downloading report:', error);
      throw error;
    }
  }
};

export default reportsService;