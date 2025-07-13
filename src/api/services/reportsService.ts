/**
 * @file api/services/reportsService.ts
 * @description Service for reports API endpoints
 */
import apiClient, { extractData, extractArray } from '../core/apiClient';
import API_CONFIG from '../core/config';

// Types
export interface Report {
  id: string;
  name: string;
  type: 'sales' | 'inventory' | 'readings' | 'custom';
  format: 'pdf' | 'csv' | 'excel';
  dateRange: {
    start: string;
    end: string;
  };
  filters?: Record<string, any>;
  createdAt: string;
  status: 'completed' | 'processing' | 'failed';
  downloadUrl?: string;
}

export interface GenerateReportRequest {
  name: string;
  type: 'sales' | 'inventory' | 'readings' | 'custom';
  format: 'pdf' | 'csv' | 'excel';
  dateRange: {
    start: string;
    end: string;
  };
  filters?: Record<string, any>;
}

/**
 * Service for reports API
 */
export const reportsService = {
  /**
   * Get all reports
   * @returns List of reports
   */
  getReports: async (): Promise<Report[]> => {
    try {
      console.log('[REPORTS-API] Fetching reports');
      
      // Return empty array for now since there's no reports storage endpoint
      // Reports are generated on-demand
      return [];
    } catch (error) {
      console.error('[REPORTS-API] Error fetching reports:', error);
      return [];
    }
  },
  
  /**
   * Get a report by ID
   * @param id Report ID
   * @returns Report details
   */
  getReport: async (id: string): Promise<Report | null> => {
    try {
      console.log(`[REPORTS-API] Fetching report details for ID: ${id}`);
      
      // Note: This endpoint might need to be updated based on actual API implementation
      const response = await apiClient.get(`reports/sales/${id}`);
      return extractData<Report>(response);
    } catch (error) {
      console.error(`[REPORTS-API] Error fetching report ${id}:`, error);
      return null;
    }
  },
  
  /**
   * Generate a new report
   * @param data Report generation request
   * @returns Generated report
   */
  generateReport: async (data: GenerateReportRequest): Promise<Blob | null> => {
    try {
      console.log('[REPORTS-API] Generating report with data:', data);

      // Map report type to endpoint
      let endpoint = '';
      switch (data.type) {
        case 'sales':
          endpoint = 'sales';
          break;
        case 'inventory':
          endpoint = 'inventory';
          break;
        case 'readings':
          endpoint = 'readings';
          break;
        default:
          endpoint = 'sales';
      }

      // Prepare request body
      const requestBody = {
        format: data.format,
        dateFrom: data.dateRange.start.split('T')[0],
        dateTo: data.dateRange.end.split('T')[0],
        stationId: data.filters?.stationId !== 'all' ? data.filters?.stationId : undefined
      };

      // Make POST request instead of GET
      const response = await apiClient.post(`${API_CONFIG.endpoints.reports.base}/${endpoint}`, requestBody, {
        responseType: 'blob',
      });

      return response.data as Blob;
    } catch (error) {
      console.error('[REPORTS-API] Error generating report:', error);
      throw error;
    }
  },
  
  /**
   * Download a report
   * @param id Report ID
   * @returns Download URL
   */
  downloadReport: async (id: string): Promise<string | null> => {
    try {
      console.log(`[REPORTS-API] Downloading report ${id}`);
      
      // Use the implemented export endpoint
      const response = await apiClient.get(`reports/sales/export?reportId=${id}`);
      return response.data.downloadUrl || '';
    } catch (error) {
      console.error(`[REPORTS-API] Error downloading report ${id}:`, error);
      return null;
    }
  },
  
  /**
   * Export a generic report
   * @param data Export request data
   * @returns Export URL
   */
  exportReport: async (data: any): Promise<string | null> => {
    try {
      console.log('[REPORTS-API] Exporting report with data:', data);
      
      // Use the implemented export endpoint
      const response = await apiClient.post('reports/export', data);
      return response.data.downloadUrl || '';
    } catch (error) {
      console.error('[REPORTS-API] Error exporting report:', error);
      return null;
    }
  },
  
  /**
   * Schedule a report
   * @param data Schedule request data
   * @returns Scheduled report
   */
  scheduleReport: async (data: any): Promise<Report | null> => {
    try {
      console.log('[REPORTS-API] Scheduling report with data:', data);
      
      // Use the implemented schedule endpoint
      const response = await apiClient.post('reports/schedule', data);
      return extractData<Report>(response);
    } catch (error) {
      console.error('[REPORTS-API] Error scheduling report:', error);
      return null;
    }
  }
};

export default reportsService;